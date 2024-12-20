import React, { useState, useEffect } from 'react';
import { Input, Button, useDisclosure, Pagination } from "@nextui-org/react";
import { Search, Filter, UserPlus } from "lucide-react";
import UserListTable from '../../components/admin/user/UserListTable';
import UserDetailModal from '../../components/admin/user/UserDetailModal';
import UserFilterModal from '../../components/admin/user/UserFilterModal';
import EditUserModal from '../../components/admin/user/EditUserModal';
import UserConfirmActionModal from '../../components/admin/user/UserConfirmActionModal';
import CreateUserModal from '../../components/admin/user/CreateUserModal';

const UserManagement = () => {
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
  const [itemsPerPage] = useState(10);

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

  useEffect(() => {
    // Load initial data
    const loadInitialData = () => {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const storedUniversities = JSON.parse(localStorage.getItem('universities') || '[]');
      const storedCities = JSON.parse(localStorage.getItem('cities') || '[]');
      
      // Ensure all users have required fields
      const processedUsers = storedUsers.map(user => ({
        ...user,
        id: user.id || String(Date.now()),
        registrationDate: user.registrationDate || new Date().toISOString(),
        status: user.status || 'Active'
      }));
      
      setUsers(processedUsers);
      setUniversities(storedUniversities);
      setCities(storedCities);
    };

    loadInitialData();

    // Listen for storage changes
    const handleStorageChange = () => {
      const updatedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(updatedUsers);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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

  const handleConfirmAction = () => {
    switch (actionType) {
      case 'suspend':
        updateUserStatus(selectedUser.id, 'Suspended');
        break;
      case 'activate':
        updateUserStatus(selectedUser.id, 'Active');
        break;
      case 'delete':
        deleteUser(selectedUser.id);
        break;
      default:
        console.log('Unknown action:', actionType);
    }
    onConfirmClose();
  };

  const updateUserStatus = (userId, newStatus) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    window.dispatchEvent(new Event('storage'));
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    window.dispatchEvent(new Event('storage'));
  };

  const handleEditUser = (updatedUser) => {
    const updatedUsers = users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    window.dispatchEvent(new Event('storage'));
    onEditClose();
  };

  const handleCreateUser = (newUser) => {
    const lastId = users.length > 0 ? Math.max(...users.map(u => parseInt(u.id))) : 0;
    const newId = String(lastId + 1).padStart(3, '0');
    
    const userWithDefaults = {
      ...newUser,
      id: newId,
      registrationDate: new Date().toISOString(),
      status: 'Active'
    };

    const updatedUsers = [...users, userWithDefaults];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    window.dispatchEvent(new Event('storage'));
    onCreateClose();
  };

  // Filter and sort users
  const getFilteredAndSortedUsers = () => {
    let filtered = users.filter(user => {
      const searchFields = [
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.role,
        user.university,
        user.city,
        user.gender,
        user.status
      ];
      
      const matchesSearch = searchFields.some(field => 
        field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesFilters = (
        (!filters.role || user.role === filters.role) &&
        (!filters.university || user.university === filters.university) &&
        (!filters.city || user.city === filters.city) &&
        (!filters.gender || user.gender === filters.gender) &&
        (!filters.status || user.status === filters.status)
      );

      return matchesSearch && matchesFilters;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'name') {
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  };

  const filteredAndSortedUsers = getFilteredAndSortedUsers();
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const currentUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white">User Management</h1>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          startContent={<Search className="text-gray-400" size={20} />}
          className="w-full sm:w-1/2 bg-gray-800 text-white rounded-full"
        />
        <Button color="primary" onPress={onFilterOpen} startContent={<Filter size={20} />}>
          Filters
        </Button>
        <Button color="success" onPress={onCreateOpen} startContent={<UserPlus size={20} />}>
          Create User
        </Button>
      </div>

      <UserListTable
        users={currentUsers}
        onUserAction={handleUserAction}
        onSort={handleSort}
        sortConfig={sortConfig}
      />

      <div className="flex justify-center mt-4">
        <Pagination
          total={totalPages}
          page={currentPage}
          onChange={setCurrentPage}
        />
      </div>

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