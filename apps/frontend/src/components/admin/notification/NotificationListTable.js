import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, Button } from "@nextui-org/react";
import { Eye, Edit2, Trash2 } from "lucide-react";

const NotificationListTable = ({ notifications, searchTerm, filters, onNotificationAction, formatDateTime }) => {
  const filteredNotifications = notifications.filter(notification => 
    (notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     notification.message.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!filters.type || notification.type === filters.type) &&
    (!filters.status || notification.status === filters.status) &&
    (!filters.startDate || new Date(notification.date) >= new Date(filters.startDate)) &&
    (!filters.endDate || new Date(notification.date) <= new Date(filters.endDate))
  );

  const columns = [
    { name: 'ID', uid: 'id', width: '80px' },
    { name: 'TITLE', uid: 'title', width: '25%' },
    { name: 'TYPE', uid: 'type', width: '120px' },
    { name: 'DATE', uid: 'date', width: '200px' },
    { name: 'STATUS', uid: 'status', width: '120px' },
    { name: 'RECIPIENTS', uid: 'recipients', width: '120px' },
    { name: 'ACTIONS', uid: 'actions', width: '180px' },
  ];

  const renderCell = (notification, columnKey) => {
    const cellValue = notification[columnKey];
    switch (columnKey) {
      case 'id':
        return <span className="text-bold text-small">#{cellValue.toString().padStart(3, '0')}</span>;
      case 'title':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{notification.message.substring(0, 50)}...</p>
          </div>
        );
      case 'type':
        return <Chip color="primary" size="sm" variant="flat">{cellValue}</Chip>;
      case 'date':
        return formatDateTime(cellValue);
      case 'status':
        return (
          <Chip
            className="capitalize"
            color={notification.status === 'Sent' ? 'success' : notification.status === 'Scheduled' ? 'warning' : 'danger'}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case 'recipients':
        return <span>{cellValue.length} users</span>;
      case 'actions':
        return (
          <div className="flex items-center gap-2 justify-center">
            <Tooltip content="View Details">
              <Button isIconOnly size="sm" variant="light" onPress={() => onNotificationAction('view', notification)}>
                <Eye size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Edit Notification">
              <Button isIconOnly size="sm" variant="light" onPress={() => onNotificationAction('edit', notification)}>
                <Edit2 size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Delete Notification">
              <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => onNotificationAction('delete', notification)}>
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
    <Table aria-label="Notification list table" className="min-w-full">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn 
            key={column.uid} 
            align={column.uid === 'actions' ? 'center' : 'start'}
            width={column.width}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={filteredNotifications}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default NotificationListTable;