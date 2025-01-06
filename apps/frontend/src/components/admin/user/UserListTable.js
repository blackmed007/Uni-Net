import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, Button } from "@nextui-org/react";
import { Eye, Edit2, UserX, UserCheck, Trash2 } from "lucide-react";

const UserListTable = ({ users, onUserAction, onSort, sortConfig }) => {
  const columns = [
    { name: '#ID', uid: 'id', sortable: true },
    { name: 'NAME', uid: 'name', sortable: true },
    { name: 'ROLE', uid: 'role', sortable: true },
    { name: 'STATUS', uid: 'status', sortable: true },
    { name: 'REGISTRATION DATE', uid: 'registrationDate', sortable: true },
    { name: 'GENDER', uid: 'gender', sortable: true },
    { name: 'UNIVERSITY', uid: 'university', sortable: true },
    { name: 'CITY', uid: 'city', sortable: true },
    { name: 'ACTIONS', uid: 'actions' },
  ];

  const renderCell = (user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case 'id':
        return <span className="text-xs font-medium text-gray-400">#{user.id}</span>;
      case 'name':
        return (
          <User
            avatarProps={{ 
              radius: "lg", 
              src: user.profilePicture || `https://i.pravatar.cc/150?u=${user.id}` 
            }}
            description={user.email}
            name={`${user.firstName} ${user.lastName}`}
          />
        );
      case 'role':
        return (
          <Chip
            color={user.role === 'Admin' ? 'primary' : 'secondary'}
            size="sm"
            variant="flat"
          >
            {user.role}
          </Chip>
        );
      case 'status':
        return (
          <Chip
            color={user.status === 'Active' ? 'success' : 'warning'}
            size="sm"
            variant="flat"
          >
            {user.status}
          </Chip>
        );
      case 'registrationDate':
        return new Date(user.registrationDate).toLocaleDateString();
      case 'actions':
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="View Details">
              <Button isIconOnly size="sm" variant="light" onPress={() => onUserAction('view', user)}>
                <Eye size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Edit User">
              <Button isIconOnly size="sm" variant="light" onPress={() => onUserAction('edit', user)}>
                <Edit2 size={20} />
              </Button>
            </Tooltip>
            {user.status === 'Active' ? (
              <Tooltip content="Suspend User">
                <Button isIconOnly size="sm" variant="light" color="warning" onPress={() => onUserAction('suspend', user)}>
                  <UserX size={20} />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip content="Activate User">
                <Button isIconOnly size="sm" variant="light" color="success" onPress={() => onUserAction('activate', user)}>
                  <UserCheck size={20} />
                </Button>
              </Tooltip>
            )}
            <Tooltip content="Delete User">
              <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => onUserAction('delete', user)}>
                <Trash2 size={20} />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  // Prepare table items with keys
  const tableItems = users.map(user => ({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    role: user.role,
    status: user.status,
    registrationDate: user.registrationDate,
    gender: user.gender,
    university: user.university,
    city: user.city,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profilePicture: user.profilePicture,
    key: user.id // Explicit key for each item
  }));

  return (
    <Table
      aria-label="User list table"
      selectionMode="none"
      className="mt-4"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn 
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            onClick={() => column.sortable && onSort(column.uid)}
            className={column.sortable ? 'cursor-pointer hover:bg-gray-800' : ''}
          >
            {column.name}
            {sortConfig.key === column.uid && (
              <span className="ml-2">
                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
              </span>
            )}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={tableItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UserListTable;