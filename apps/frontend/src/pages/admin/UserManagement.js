import React, { useState, useEffect, useMemo } from 'react';
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
  const [allUsers, setAllUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    universityId: '',
    cityId: '',
    gender: '',
    status: '',
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal controls
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const { isOpen: isUserDetailOpen, onOpen: onUserDetailOpen, onClose: onUserDetailClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

  // Fetch initial data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [usersResponse, citiesResponse, universitiesResponse] = await Promise.all([
        UsersAPI.getUsers(),
        LocationAPI.fetchCities(),
        LocationAPI.fetchUniversities()
      ]);

      setAllUsers(usersResponse || []);
      setCities(citiesResponse || []);
      setUniversities(universitiesResponse || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter and search logic
  const filterAndSearchUsers = useMemo(() => {
    return allUsers.filter(user => {
      // Search functionality
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const searchFields = [
          user.firstName,
          user.lastName,
          user.email,
          user.role,
          user.gender,
          user.university?.name,
          user.city?.name
        ].filter(Boolean);

        const matchesSearch = searchFields.some(field => 
          field.toString().toLowerCase().includes(searchLower)
        );

        if (!matchesSearch) return false;
      }

      // Filter functionality
      // Role filter - case insensitive comparison
      if (filters.role && user.role?.toLowerCase() !== filters.role.toLowerCase()) {
        return false;
      }

      // University filter
      if (filters.universityId && user.universityId !== filters.universityId) {
        return false;
      }

      // City filter
      if (filters.cityId && user.cityId !== filters.cityId) {
        return false;
      }

      // Gender filter - case insensitive comparison
      if (filters.gender && user.gender?.toLowerCase() !== filters.gender.toLowerCase()) {
        return false;
      }

      // Status filter
      if (filters.status && user.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [allUsers, searchTerm, filters]);

  // Sorting logic
  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filterAndSearchUsers;

    return [...filterAndSearchUsers].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle nested properties for university and city
      if (sortConfig.key === 'university') {
        aValue = a.university?.name;
        bValue = b.university?.name;
      } else if (sortConfig.key === 'city') {
        aValue = a.city?.name;
        bValue = b.city?.name;
      }

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      if (aValue === bValue) return 0;

      // Case insensitive comparison for string values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      const compareResult = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'ascending' ? compareResult : -compareResult;
    });
  }, [filterAndSearchUsers, sortConfig]);

  // Pagination logic
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setDisplayedUsers(sortedUsers.slice(start, end));
  }, [sortedUsers, currentPage, itemsPerPage]);

  // Event handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'ascending' 
        ? 'descending' 
        : 'ascending'
    }));
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

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

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
        users={displayedUsers}
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