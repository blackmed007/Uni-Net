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
  Button
} from "@nextui-org/react";
import { Eye, Edit2, UserX, UserCheck, Trash2 } from "lucide-react";

const UserListTable = ({ users, onUserAction, onSort, sortConfig, isLoading }) => {
  const columns = [
    { name: '#ID', uid: 'id', sortable: true },
    { name: 'NAME', uid: 'name', sortable: true },
    { name: 'ROLE', uid: 'role', sortable: true },
    { name: 'STATUS', uid: 'status', sortable: true },
    { name: 'REGISTRATION DATE', uid: 'createdAt', sortable: true },
    { name: 'GENDER', uid: 'gender', sortable: true },
    { name: 'UNIVERSITY', uid: 'university', sortable: true },
    { name: 'CITY', uid: 'city', sortable: true },
    { name: 'ACTIONS', uid: 'actions', sortable: false },
  ];

  // Helper functions
  const formatUserId = (id) => {
    if (!id) return 'N/A';
    return id.toString().replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const formatTooltipText = (text, maxLength = 90, lineLength = 30) => {
    if (!text) return 'N/A';
    const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    return truncatedText.replace(new RegExp(`(.{1,${lineLength}})`, 'g'), '$1\n');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const renderCell = (user, columnKey) => {
    try {
      if (!user) return 'N/A';
      const cellValue = user[columnKey];

      switch (columnKey) {
        case 'id':
          return (
            <Tooltip content={user.id} showArrow>
              <span className="text-xs font-medium text-gray-400">
                #{formatUserId(user.id)}
              </span>
            </Tooltip>
          );

        case 'name':
          const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'N/A';
          return (
            <User
              avatarProps={{ 
                radius: "lg", 
                size: "sm",
                src: user.profile_url || `https://via.placeholder.com/32?text=${fullName.charAt(0)}`,
                className: "bg-gray-700"
              }}
              description={truncateText(user.email, 20)}
              name={truncateText(fullName, 20)}
              classNames={{
                name: "text-white",
                description: "text-gray-400"
              }}
            >
              {user.email}
            </User>
          );

        case 'role':
          return (
            <Tooltip content={cellValue} showArrow isDisabled={!cellValue || cellValue.length <= 15}>
              <Chip
                color={user.role?.toLowerCase() === 'admin' ? 'primary' : 'secondary'}
                size="sm"
                variant="flat"
              >
                {truncateText(cellValue || 'User', 15)}
              </Chip>
            </Tooltip>
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
          const formattedDate = formatDate(cellValue);
          return (
            <Tooltip content={formattedDate} showArrow>
              <div className="flex flex-col">
                <span className="text-xs whitespace-nowrap">
                  {formattedDate}
                </span>
              </div>
            </Tooltip>
          );

        case 'gender':
          return (
            <span className="text-xs capitalize">
              {cellValue || 'N/A'}
            </span>
          );

        case 'university':
          const universityName = typeof user.university === 'object' ? user.university?.name : user.university;
          return (
            <Tooltip 
              content={universityName || 'N/A'} 
              showArrow 
              isDisabled={!universityName || universityName.length <= 20}
            >
              <span className="text-xs">
                {truncateText(universityName, 20)}
              </span>
            </Tooltip>
          );

        case 'city':
          const cityName = typeof user.city === 'object' ? user.city?.name : user.city;
          return (
            <Tooltip 
              content={cityName || 'N/A'} 
              showArrow 
              isDisabled={!cityName || cityName.length <= 20}
            >
              <span className="text-xs">
                {truncateText(cityName, 20)}
              </span>
            </Tooltip>
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
                  isDisabled={isLoading}
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
                  isDisabled={isLoading}
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
                    isDisabled={isLoading}
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
                    isDisabled={isLoading}
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
                  isDisabled={isLoading}
                >
                  <Trash2 size={18} />
                </Button>
              </Tooltip>
            </div>
          );

        default:
          return cellValue || 'N/A';
      }
    } catch (error) {
      console.error('Error rendering cell:', error);
      return 'Error';
    }
  };

  return (
    <Table
      aria-label="User list table"
      selectionMode="none"
      className="mt-4"
      bottomContent={
        isLoading && (
          <div className="flex justify-center w-full py-2">
            <svg 
              className="animate-spin h-5 w-5 text-gray-500" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )
      }
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn 
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            className={`text-small uppercase ${column.sortable ? 'cursor-pointer hover:bg-gray-800' : ''}`}
            onClick={() => column.sortable && onSort(column.uid)}
          >
            <div className="flex items-center gap-2">
              {column.name}
              {sortConfig.key === column.uid && (
                <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
              )}
            </div>
          </TableColumn>
        )}
      </TableHeader>
      <TableBody 
        items={users}
        emptyContent={
          <div className="text-center text-default-400">
            No users found
          </div>
        }
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