import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, Button } from "@nextui-org/react";
import { Eye, Edit2, UserX, UserCheck, Trash2 } from "lucide-react";

const UserListTable = ({ users, onUserAction, onSort, sortConfig }) => {
  const columns = [
    { name: '#ID', uid: 'id' },
    { name: 'NAME', uid: 'name' },
    { name: 'ROLE', uid: 'role' },
    { name: 'STATUS', uid: 'status' },
    { name: 'REGISTRATION DATE', uid: 'registrationDate' },
    { name: 'GENDER', uid: 'gender' },
    { name: 'UNIVERSITY', uid: 'university' },
    { name: 'CITY', uid: 'city' },
    { name: 'ACTIONS', uid: 'actions' },
  ];

  const renderCell = (user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case 'id':
        return <span className="text-xs font-medium text-gray-400">#{cellValue}</span>;
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'lg', src: user.profilePicture || `https://i.pravatar.cc/150?u=${user.id}` }}
            description={user.email}
            name={`${user.firstName} ${user.lastName}`}
          >
            {user.email}
          </User>
        );
      case 'role':
        return (
          <Chip
            color={user.role === 'Admin' ? 'primary' : 'secondary'}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case 'status':
        return (
          <Chip
            color={cellValue === 'Active' ? 'success' : 'warning'}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case 'registrationDate':
        return new Date(cellValue).toLocaleDateString();
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

  return (
    <Table aria-label="User list table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn 
            key={column.uid} 
            align={column.uid === 'actions' ? 'center' : 'start'}
            onClick={() => column.uid !== 'actions' && onSort(column.uid)}
            style={{ cursor: column.uid !== 'actions' ? 'pointer' : 'default' }}
          >
            {column.name}
            {sortConfig.key === column.uid && (
              <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
            )}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={users}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UserListTable;