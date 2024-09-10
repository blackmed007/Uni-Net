import React, { useState, useEffect } from 'react';
import { Input, Button, useDisclosure, Pagination } from "@nextui-org/react";
import { Search, Filter, UserPlus } from "lucide-react";
import UserListTable from '../../components/admin/user/UserListTable';
import UserDetailModal from '../../components/admin/user/UserDetailModal';
import UserFilterModal from '../../components/admin/user/UserFilterModal';
import EditUserModal from '../../components/admin/user/EditUserModal';
import ConfirmActionModal from '../../components/common/ConfirmActionModal';
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

  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const { isOpen: isUserDetailOpen, onOpen: onUserDetailOpen, onClose: onUserDetailClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const storedUniversities = JSON.parse(localStorage.getItem('universities') || '[]');
    const storedCities = JSON.parse(localStorage.getItem('cities') || '[]');
    
    setUsers(storedUsers);
    setUniversities(storedUniversities);
    setCities(storedCities);
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
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleEditUser = (updatedUser) => {
    const updatedUsers = users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    onEditClose();
  };

  const handleCreateUser = (newUser) => {
    const updatedUsers = [...users, { ...newUser, id: Date.now().toString(), createdAt: new Date().toISOString() }];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    onCreateClose();
  };

  const filteredUsers = users.filter(user => {
    const searchFields = [
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
      field && field.toLowerCase().includes(searchTerm.toLowerCase())
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

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';

    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">User Management</h1>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          startContent={<Search className="text-gray-400" size={20} />}
          className="w-full sm:w-1/2"
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
          total={Math.ceil(sortedUsers.length / itemsPerPage)}
          page={currentPage}
          onChange={paginate}
        />
      </div>
      <UserDetailModal
        isOpen={isUserDetailOpen}
        onClose={onUserDetailClose}
        user={selectedUser}
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
      <ConfirmActionModal
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