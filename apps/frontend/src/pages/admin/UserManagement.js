import React, { useState, useEffect, useMemo } from 'react';
import { Input, Button, useDisclosure, Pagination } from "@nextui-org/react";
import { Search, Filter, UserPlus, User2 } from "lucide-react";
import { motion } from "framer-motion";
import UserListTable from '../../components/admin/user/UserListTable';
import UserDetailModal from '../../components/admin/user/UserDetailModal';
import UserFilterModal from '../../components/admin/user/UserFilterModal';
import EditUserModal from '../../components/admin/user/EditUserModal';
import UserConfirmActionModal from '../../components/admin/user/UserConfirmActionModal';
import CreateUserModal from '../../components/admin/user/CreateUserModal';
import UsersAPI from '../../services/users.api';
import LocationAPI from '../../services/location.api';
import { toast } from 'react-hot-toast';

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
  const [itemsPerPage] = useState(30);
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
      setError('Failed to fetch data. Please try again later.');
      toast.error('Failed to fetch data');
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
      if (filters.role && user.role?.toLowerCase() !== filters.role.toLowerCase()) {
        return false;
      }

      if (filters.universityId && user.universityId !== filters.universityId) {
        return false;
      }

      if (filters.cityId && user.cityId !== filters.cityId) {
        return false;
      }

      if (filters.gender && user.gender?.toLowerCase() !== filters.gender.toLowerCase()) {
        return false;
      }

      if (filters.status) {
        const isActive = user.status === true || user.status === 'Active';
        if (filters.status === 'Active' && !isActive) return false;
        if (filters.status === 'Suspended' && isActive) return false;
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

      if (sortConfig.key === 'university') {
        aValue = a.university?.name;
        bValue = b.university?.name;
      } else if (sortConfig.key === 'city') {
        aValue = a.city?.name;
        bValue = b.city?.name;
      }

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      if (aValue === bValue) return 0;

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
    onFilterClose();
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
        console.error('Unknown action:', action);
    }
  };

  const handleConfirmAction = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userName = `${selectedUser.firstName} ${selectedUser.lastName}`.trim();
      
      switch (actionType) {
        case 'suspend':
          await UsersAPI.suspendUser(selectedUser.id);
          toast.success(`${userName} has been suspended`);
          break;
        case 'activate':
          await UsersAPI.activateUser(selectedUser.id);
          toast.success(`${userName} has been activated`);
          break;
        case 'delete':
          await UsersAPI.deleteUser(selectedUser.id);
          toast.success(`${userName} has been deleted`);
          break;
        default:
          throw new Error('Unknown action type');
      }
      
      await fetchData();
      onConfirmClose();
      onUserDetailClose(); // Close the detail modal if it's open
    } catch (error) {
      console.error('Error performing action:', error);
      setError(error.response?.data?.message || 'Failed to perform action');
      toast.error('Failed to perform action');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      setIsLoading(true);
      setError(null);
      await UsersAPI.updateUser(updatedUser.id, updatedUser);
      await fetchData();
      onEditClose();
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.response?.data?.message || 'Failed to update user');
      toast.error('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      await UsersAPI.createUser(userData);
      await fetchData();
      onCreateClose();
      toast.success('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.response?.data?.message || 'Failed to create user');
      toast.error('Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold">User Management</h1>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-4 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          startContent={<Search className="text-gray-400" size={20} />}
          className="w-full sm:w-1/2"
        />
        <Button 
          color="primary" 
          onPress={onFilterOpen} 
          startContent={<Filter size={20} />}
          isDisabled={isLoading}
        >
          Filters
        </Button>
        <Button 
          color="success" 
          onPress={onCreateOpen} 
          startContent={<UserPlus size={20} />}
          isDisabled={isLoading}
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white"
        >
          Create User
        </Button>
      </div>

      {displayedUsers.length === 0 && !isLoading ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-10"
        >
          <User2 size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-500">No users found. Create a new user to get started.</p>
        </motion.div>
      ) : (
        <>
          <UserListTable
            users={displayedUsers}
            onUserAction={handleUserAction}
            onSort={handleSort}
            sortConfig={sortConfig}
            isLoading={isLoading}
          />

          <div className="flex justify-center mt-4">
            <Pagination
              total={Math.ceil(sortedUsers.length / itemsPerPage)}
              page={currentPage}
              onChange={setCurrentPage}
              color="primary"
              showControls
              showShadow
              variant="flat"
              isDisabled={sortedUsers.length <= itemsPerPage || isLoading}
            />
          </div>
        </>
      )}

      <UserDetailModal
        isOpen={isUserDetailOpen}
        onClose={onUserDetailClose}
        user={selectedUser}
        onEditUser={() => { onUserDetailClose(); onEditOpen(); }}
        onDeleteUser={(userId) => {
          onUserDetailClose();
          setActionType('delete');
          setSelectedUser({ ...selectedUser, id: userId });
          onConfirmOpen();
        }}
        onSuspendUser={(userId) => {
          onUserDetailClose();
          setActionType('suspend');
          setSelectedUser({ ...selectedUser, id: userId });
          onConfirmOpen();
        }}
        onActivateUser={(userId) => {
          onUserDetailClose();
          setActionType('activate');
          setSelectedUser({ ...selectedUser, id: userId });
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