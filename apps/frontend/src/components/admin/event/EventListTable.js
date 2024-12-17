import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Button } from "@nextui-org/react";
import { Eye, Edit2, XCircle, Trash2, Users, BarChart2, Play, Calendar, Briefcase, MapPin } from "lucide-react";

const EventListTable = ({ events, onEventAction, onSort, sortConfig }) => {
  const getEventStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'primary';
      case 'Ongoing': return 'success';
      case 'Completed': return 'secondary';
      case 'Cancelled': return 'danger';
      default: return 'default';
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'Workshop': return 'primary';
      case 'Seminar': return 'secondary';
      case 'Conference': return 'success';
      case 'Social': return 'warning';
      default: return 'default';
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'Workshop': return Briefcase;
      case 'Seminar': return Users;
      case 'Conference': return Calendar;
      case 'Social': return MapPin;
      default: return Calendar;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const columns = [
    { name: '#ID', uid: 'id', width: '8%' },
    { name: 'EVENT NAME', uid: 'name', width: '20%' },
    { name: 'ORGANIZER', uid: 'organizer', width: '15%' },
    { name: 'TYPE', uid: 'type', width: '10%' },
    { name: 'DATE', uid: 'date', width: '12%' },
    { name: 'STATUS', uid: 'status', width: '10%' },
    { name: 'PARTICIPANTS', uid: 'participants', width: '10%' },
    { name: 'TOTAL VIEWS', uid: 'totalViews', width: '10%' },
    { name: 'ACTIONS', uid: 'actions', width: '15%' },
  ];

  const renderCell = (event, columnKey) => {
    const cellValue = event[columnKey];
    switch (columnKey) {
      case 'id':
        return <span className="text-xs font-medium text-gray-400">#{cellValue}</span>;
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
      case 'type':
        const typeColor = getEventTypeColor(event.type);
        return (
          <Chip
            className="capitalize"
            color={typeColor}
            size="sm"
            variant="flat"
          >
            {cellValue || 'N/A'}
          </Chip>
        );
      case 'date':
        return <span className="whitespace-nowrap">{formatDate(cellValue)}</span>;
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
      case 'totalViews':
        return (
          <div className="flex items-center">
            <BarChart2 className="mr-2" size={16} />
            <span>{event.totalViews || 0}</span>
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
            {event.status !== 'Cancelled' ? (
              <Tooltip content="Cancel Event">
                <Button isIconOnly size="sm" variant="light" color="warning" onPress={() => onEventAction('cancel', event)}>
                  <XCircle size={20} />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip content="Make Ongoing">
                <Button isIconOnly size="sm" variant="light" color="success" onPress={() => onEventAction('ongoing', event)}>
                  <Play size={20} />
                </Button>
              </Tooltip>
            )}
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
          <TableColumn 
            key={column.uid} 
            align={column.uid === 'actions' ? 'center' : 'start'}
            width={column.width}
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
      <TableBody items={events}>
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