import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, Button } from "@nextui-org/react";
import { Eye, Edit2, XCircle, Trash2, Users } from "lucide-react";
import { getEventStatusColor, getEventTypeIcon } from '../../../utils/eventHelpers';

const EventListTable = ({ events, searchTerm, filters, onEventAction }) => {
  const filteredEvents = events.filter(event => 
    (event && typeof event === 'object') &&
    ((event.name && event.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (event.organizer && event.organizer.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (!filters.type || (event.type && event.type === filters.type)) &&
    (!filters.status || (event.status && event.status === filters.status)) &&
    (!filters.date || (event.date && event.date === filters.date))
  );

  const columns = [
    { name: 'EVENT NAME', uid: 'name' },
    { name: 'ORGANIZER', uid: 'organizer' },
    { name: 'TYPE', uid: 'type' },
    { name: 'DATE', uid: 'date' },
    { name: 'STATUS', uid: 'status' },
    { name: 'PARTICIPANTS', uid: 'participants' },
    { name: 'ACTIONS', uid: 'actions' },
  ];

  const renderCell = (event, columnKey) => {
    if (!event || typeof event !== 'object') {
      return 'N/A';
    }

    const cellValue = event[columnKey];
    switch (columnKey) {
      case 'name':
        const EventTypeIcon = getEventTypeIcon(event.type);
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize flex items-center">
              <EventTypeIcon className="mr-2" size={16} />
              {cellValue || 'N/A'}
            </p>
            <p className="text-bold text-tiny capitalize text-default-400">{event.type || 'N/A'}</p>
          </div>
        );
      case 'status':
        const statusColor = getEventStatusColor(event.status);
        return (
          <Chip
            className="capitalize"
            color={statusColor}
            size="sm"
            variant="flat"
          >
            {cellValue || 'N/A'}
          </Chip>
        );
      case 'participants':
        return (
          <div className="flex items-center">
            <Users className="mr-2" size={16} />
            <span>{event.participants ? event.participants.length : 0} / {event.maxParticipants || 'N/A'}</span>
          </div>
        );
      case 'actions':
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="View Details">
              <Button isIconOnly size="sm" variant="light" onPress={() => onEventAction('view', event)}>
                <Eye size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Edit Event">
              <Button isIconOnly size="sm" variant="light" onPress={() => onEventAction('edit', event)}>
                <Edit2 size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Cancel Event">
              <Button isIconOnly size="sm" variant="light" color="warning" onPress={() => onEventAction('cancel', event)}>
                <XCircle size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Delete Event">
              <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => onEventAction('delete', event)}>
                <Trash2 size={20} />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue || 'N/A';
    }
  };

  return (
    <Table aria-label="Event list table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={filteredEvents}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default EventListTable;