import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, Button } from "@nextui-org/react";
import { Eye, Edit2, Trash2, Bell } from "lucide-react";

const NotificationListTable = ({ notifications, searchTerm, filters, onNotificationAction }) => {
  const filteredNotifications = notifications.filter(notification => 
    (notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     notification.message.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!filters.type || notification.type === filters.type) &&
    (!filters.status || notification.status === filters.status) &&
    (!filters.date || notification.date === filters.date)
  );

  const columns = [
    { name: 'TITLE', uid: 'title' },
    { name: 'TYPE', uid: 'type' },
    { name: 'DATE', uid: 'date' },
    { name: 'STATUS', uid: 'status' },
    { name: 'RECIPIENTS', uid: 'recipients' },
    { name: 'ACTIONS', uid: 'actions' },
  ];

  const renderCell = (notification, columnKey) => {
    const cellValue = notification[columnKey];
    switch (columnKey) {
      case 'title':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{notification.message.substring(0, 50)}...</p>
          </div>
        );
      case 'type':
        return <Chip color="primary" size="sm" variant="flat">{cellValue}</Chip>;
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
          <div className="flex items-center gap-2">
            <Tooltip content={<span className="bg-white text-black px-2 py-1 rounded">View Details</span>}>
              <Button isIconOnly size="sm" variant="light" onPress={() => onNotificationAction('view', notification)}>
                <Eye size={20} />
              </Button>
            </Tooltip>
            <Tooltip content={<span className="bg-white text-black px-2 py-1 rounded">Edit Notification</span>}>
              <Button isIconOnly size="sm" variant="light" onPress={() => onNotificationAction('edit', notification)}>
                <Edit2 size={20} />
              </Button>
            </Tooltip>
            <Tooltip content={<span className="bg-white text-black px-2 py-1 rounded">Delete Notification</span>}>
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
    <Table aria-label="Notification list table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={filteredNotifications}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default NotificationListTable;