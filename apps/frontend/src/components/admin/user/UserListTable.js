import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  User, 
  Chip, 
  Tooltip, 
  Button,
  Spinner 
} from "@nextui-org/react";
import { Eye, Edit2, UserX, UserCheck, Trash2 } from "lucide-react";

const UserListTable = ({ users, onUserAction, onSort, sortConfig, isLoading }) => {
  const columns = [
    { name: '#ID', uid: 'id', sortable: false },
    { name: 'NAME', uid: 'name', sortable: false },
    { name: 'ROLE', uid: 'role', sortable: false },
    { name: 'STATUS', uid: 'status', sortable: false },
    { name: 'REGISTRATION DATE', uid: 'createdAt', sortable: false },
    { name: 'GENDER', uid: 'gender', sortable: false },
    { name: 'UNIVERSITY', uid: 'university', sortable: false },
    { name: 'CITY', uid: 'city', sortable: false },
    { name: 'ACTIONS', uid: 'actions' },
  ];

  const renderCell = (user, columnKey) => {
    if (!user) return null;
    
    // Get the cell value for the default case
    const cellValue = user[columnKey];

    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-400">
              #{user.id?.replace(/[^a-zA-Z0-9]/g, '').substring(0, 9)}
            </span>
          </div>
        );

      case 'name':
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'N/A';
        return (
          <User
            avatarProps={{ 
              radius: "lg", 
              size: "sm",
              src: user.profile_url || `https://i.pravatar.cc/150?u=${user.id}`,
              className: "bg-gray-700"
            }}
            description={user.email || 'No email'}
            name={fullName}
            classNames={{
              name: "text-white",
              description: "text-gray-400"
            }}
          />
        );

      case 'role':
        return (
          <Chip
            color={user.role?.toLowerCase() === 'admin' ? 'primary' : 'secondary'}
            size="sm"
            variant="flat"
          >
            {user.role || 'User'}
          </Chip>
        );

      case 'status':
        const status = user.status === true || user.status === 'Active' ? 'Active' : 'Suspended';
        return (
          <Chip
            color={status === 'Active' ? 'success' : 'warning'}
            size="sm"
            variant="flat"
          >
            {status}
          </Chip>
        );

      case 'createdAt':
        return (
          <div className="flex flex-col text-center">
            <span className="text-xs">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        );

      case 'gender':
        return (
          <span className="text-xs capitalize">
            {user.gender || 'N/A'}
          </span>
        );

      case 'university':
        return (
          <span className="text-xs">
            {typeof user.university === 'object' ? user.university?.name : user.university || 'N/A'}
          </span>
        );

      case 'city':
        return (
          <span className="text-xs">
            {typeof user.city === 'object' ? user.city?.name : user.city || 'N/A'}
          </span>
        );

      case 'actions':
        return (
          <div className="flex items-center gap-2 justify-center">
            <Tooltip content="View Details">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                onPress={() => onUserAction('view', user)}
              >
                <Eye size={18} />
              </Button>
            </Tooltip>
            <Tooltip content="Edit User">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                onPress={() => onUserAction('edit', user)}
              >
                <Edit2 size={18} />
              </Button>
            </Tooltip>
            {(user.status === true || user.status === 'Active') ? (
              <Tooltip content="Suspend User">
                <Button 
                  isIconOnly 
                  size="sm" 
                  variant="light" 
                  color="warning" 
                  onPress={() => onUserAction('suspend', user)}
                >
                  <UserX size={18} />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip content="Activate User">
                <Button 
                  isIconOnly 
                  size="sm" 
                  variant="light" 
                  color="success" 
                  onPress={() => onUserAction('activate', user)}
                >
                  <UserCheck size={18} />
                </Button>
              </Tooltip>
            )}
            <Tooltip content="Delete User">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                color="danger" 
                onPress={() => onUserAction('delete', user)}
              >
                <Trash2 size={18} />
              </Button>
            </Tooltip>
          </div>
        );

      default:
        return cellValue || 'N/A';
    }
  };

  // ... rest of the component remains the same ...

  return (
    <Table
      aria-label="User list table"
      selectionMode="none"
      className="mt-4"
      bottomContent={
        isLoading && (
          <div className="flex justify-center w-full">
            <Spinner size="sm" color="white" />
          </div>
        )
      }
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn 
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            onClick={() => column.sortable && onSort(column.uid)}
            className={column.sortable ? 'cursor-pointer hover:bg-gray-800' : ''}
            allowsSorting={column.sortable}
          >
            <div className="flex items-center gap-4">
              {column.name}
              {sortConfig.key === column.uid && (
                <span className="text-gray-500">
                  {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                </span>
              )}
            </div>
          </TableColumn>
        )}
      </TableHeader>
      <TableBody 
        items={users.map(user => ({
          ...user,
          key: user.id
        }))}
        emptyContent="No users found"
      >
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