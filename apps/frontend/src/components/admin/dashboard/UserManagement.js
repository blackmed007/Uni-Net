import React, { useState, useEffect } from 'react';
import { Input, Button, useDisclosure } from "@nextui-org/react";
import { Search, Filter, UserPlus } from "lucide-react";
import UserListTable from '../user/UserListTable';
import UserDetailModal from '../user/UserDetailModal';
import UserFilterModal from '../user/UserFilterModal';
import EditUserModal from '../user/EditUserModal';
import ConfirmActionModal from './components/ConfirmActionModal';
import CreateUserModal from '../user/CreateUserModal';

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
    const storedUsers = localStorage.getItem('users');
    const storedUniversities = JSON.parse(localStorage.getItem('universities') || '[]');
    const storedCities = JSON.parse(localStorage.getItem('cities') || '[]');
    setUniversities(storedUniversities);
    setCities(storedCities);

    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      const updatedUsers = parsedUsers.map(user => ({
        ...user,
        university: storedUniversities.find(uni => uni.id === user.universityId)?.name || user.university,
        city: storedCities.find(city => city.id === user.cityId)?.name || user.city
      }));
      setUsers(updatedUsers);
    } else {
      // If no users in local storage, initialize with mock data
      const mockUsers = [
        { id: 1, name: 'Jan Kowalski', email: 'jan@example.com', role: 'Student', status: 'Active', registrationDate: '2023-01-15', gender: 'Male', university: 'Warsaw University of Technology', city: 'Warsaw' },
        { id: 2, name: 'Anna Nowak', email: 'anna@example.com', role: 'Teacher', status: 'Active', registrationDate: '2023-02-20', gender: 'Female', university: 'Jagiellonian University', city: 'Poznan' },
        { id: 3, name: 'Piotr Wiśniewski', email: 'piotr@example.com', role: 'Student', status: 'Suspended', registrationDate: '2023-03-10', gender: 'Male', university: 'Adam Mickiewicz University', city: 'Poznan' },
        { id: 4, name: 'Ewa Dąbrowska', email: 'ewa@example.com', role: 'Admin', status: 'Active', registrationDate: '2023-04-05', gender: 'Female', university: 'Wrocław University of Science and Technology', city: 'Wroclaw' },
        { id: 5, name: 'Marek Lewandowski', email: 'marek@example.com', role: 'Student', status: 'Active', registrationDate: '2023-05-12', gender: 'Male', university: 'University of Warsaw', city: 'Warsaw' },
      ];
      setUsers(mockUsers);
      localStorage.setItem('users', JSON.stringify(mockUsers));
    }
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
    const updatedUsers = [...users, { ...newUser, id: Date.now(), registrationDate: new Date().toISOString().split('T')[0] }];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    onCreateClose();
  };

  const filteredUsers = users.filter(user => 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!filters.role || user.role === filters.role) &&
    (!filters.university || user.university === filters.university) &&
    (!filters.city || user.city === filters.city) &&
    (!filters.gender || user.gender === filters.gender) &&
    (!filters.status || user.status === filters.status)
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
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
        {/* Add pagination component here */}
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