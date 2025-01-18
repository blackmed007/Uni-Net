import React, { useState, useEffect } from 'react';
import { Input, Button, useDisclosure, Pagination } from "@nextui-org/react";
import { Search, Filter, UserPlus } from "lucide-react";
import UserListTable from '../../components/admin/user/UserListTable';
import UserDetailModal from '../../components/admin/user/UserDetailModal';
import UserFilterModal from '../../components/admin/user/UserFilterModal';
import EditUserModal from '../../components/admin/user/EditUserModal';
import UserConfirmActionModal from '../../components/admin/user/UserConfirmActionModal';
import CreateUserModal from '../../components/admin/user/CreateUserModal';
import UsersAPI from '../../services/users.api';
import LocationAPI from '../../services/location.api';

const UserManagement = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    university: '',
    city: '',
    gender: '',
    status: '',
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal controls
  const { 
    isOpen: isFilterOpen, 
    onOpen: onFilterOpen, 
    onClose: onFilterClose 
  } = useDisclosure();
  
  const { 
    isOpen: isUserDetailOpen, 
    onOpen: onUserDetailOpen, 
    onClose: onUserDetailClose 
  } = useDisclosure();
  
  const { 
    isOpen: isEditOpen, 
    onOpen: onEditOpen, 
    onClose: onEditClose 
  } = useDisclosure();
  
  const { 
    isOpen: isConfirmOpen, 
    onOpen: onConfirmOpen, 
    onClose: onConfirmClose 
  } = useDisclosure();
  
  const { 
    isOpen: isCreateOpen, 
    onOpen: onCreateOpen, 
    onClose: onCreateClose 
  } = useDisclosure();

  // Fetch data from APIs
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch users with params
      const usersResponse = await UsersAPI.getUsers({
        page: currentPage,
        perPage: itemsPerPage,
        search: searchTerm,
        sortBy: sortConfig.key,
        sortDirection: sortConfig.direction,
        ...filters
      });

      // Safely handle the response data
      if (usersResponse) {
        let usersData = [];
        if (Array.isArray(usersResponse)) {
          usersData = usersResponse;
        } else if (usersResponse.data && Array.isArray(usersResponse.data)) {
          usersData = usersResponse.data;
        }
        
        // Transform and set users data
        setUsers(usersData);
        
        // Set total pages if pagination info is available
        if (usersResponse.meta?.total) {
          setTotalPages(Math.ceil(usersResponse.meta.total / itemsPerPage));
        } else if (Array.isArray(usersResponse)) {
          setTotalPages(Math.ceil(usersResponse.length / itemsPerPage));
        }
      }

      // Fetch cities if needed
      if (cities.length === 0) {
        const citiesResponse = await LocationAPI.fetchCities();
        if (citiesResponse && Array.isArray(citiesResponse)) {
          setCities(citiesResponse);
        }
      }
      
      // Fetch universities if needed
      if (universities.length === 0) {
        const universitiesResponse = await LocationAPI.fetchUniversities();
        if (universitiesResponse && Array.isArray(universitiesResponse)) {
          setUniversities(universitiesResponse);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Effect hooks
  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, sortConfig, filters]);

  // Event handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    onFilterClose();
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleUserAction = (action, user) => {
    setSelectedUser(user);
    setActionType(action);
    
    switch (action) {
      case 'view':
        onUserDetailOpen();
        break;
      case 'edit':
        onEditOpen();
        break;
      case 'suspend':
      case 'activate':
      case 'delete':
        onConfirmOpen();
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleConfirmAction = async () => {
    try {
      setIsLoading(true);
      switch (actionType) {
        case 'suspend':
          await UsersAPI.suspendUser(selectedUser.id);
          break;
        case 'activate':
          await UsersAPI.activateUser(selectedUser.id);
          break;
        case 'delete':
          await UsersAPI.deleteUser(selectedUser.id);
          break;
        default:
          throw new Error('Unknown action type');
      }
      
      // Refresh data after successful action
      await fetchData();
      onConfirmClose();
    } catch (error) {
      console.error('Error performing action:', error);
      setError('Failed to perform action. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      setIsLoading(true);
      await UsersAPI.updateUser(updatedUser.id, updatedUser);
      await fetchData();
      onEditClose();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      setIsLoading(true);
      await UsersAPI.createUser(userData);
      await fetchData();
      onCreateClose();
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white">User Management</h1>
      
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          startContent={<Search className="text-gray-400" size={20} />}
          className="w-full sm:w-1/2 bg-gray-800 text-white rounded-full"
        />
        <Button 
          color="primary" 
          onPress={onFilterOpen} 
          startContent={<Filter size={20} />}
        >
          Filters
        </Button>
        <Button 
          color="success" 
          onPress={onCreateOpen} 
          startContent={<UserPlus size={20} />}
        >
          Create User
        </Button>
      </div>

      <UserListTable
        users={users}
        onUserAction={handleUserAction}
        onSort={handleSort}
        sortConfig={sortConfig}
        isLoading={isLoading}
      />

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
          />
        </div>
      )}

      <UserDetailModal
        isOpen={isUserDetailOpen}
        onClose={onUserDetailClose}
        user={selectedUser}
        onEditUser={() => { onUserDetailClose(); onEditOpen(); }}
        onDeleteUser={(userId) => {
          onUserDetailClose();
          setActionType('delete');
          setSelectedUser({ id: userId });
          onConfirmOpen();
        }}
        onBanUser={(userId) => {
          onUserDetailClose();
          setActionType('suspend');
          setSelectedUser({ id: userId });
          onConfirmOpen();
        }}
        onActivateUser={(userId) => {
          onUserDetailClose();
          setActionType('activate');
          setSelectedUser({ id: userId });
          onConfirmOpen();
        }}
      />

      <UserFilterModal
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        onApplyFilters={handleFilter}
        initialFilters={filters}
        universities={universities}
        cities={cities}
      />

      <EditUserModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        user={selectedUser}
        onSave={handleEditUser}
        universities={universities}
        cities={cities}
      />

      <UserConfirmActionModal
        isOpen={isConfirmOpen}
        onClose={onConfirmClose}
        onConfirm={handleConfirmAction}
        actionType={actionType}
      />

      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSave={handleCreateUser}
        universities={universities}
        cities={cities}
      />
    </div>
  );
};

export default UserManagement;