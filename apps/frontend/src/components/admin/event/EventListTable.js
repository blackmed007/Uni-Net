import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Button,
} from "@nextui-org/react";
import {
  Eye,
  Edit2,
  XCircle,
  Trash2,
  Users,
  BarChart2,
  Play,
  Calendar,
  Briefcase,
  MapPin,
} from "lucide-react";
import EventsAPI from "../../../services/events.api"; 

const EventListTable = ({ events, onEventAction, onSort, sortConfig }) => {
  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Format tooltip text with line breaks for readability
  const formatTooltipText = (text, maxLength = 90, lineLength = 30) => {
    if (!text) return '';
    const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    return truncatedText.replace(new RegExp(`(.{1,${lineLength}})`, 'g'), '$1\n');
  };

  // Format event ID to match BlogPostList style
  const formatEventId = (id) => {
    if (!id) return '';
    return id.toString().replace(/[^a-zA-Z0-9]/g, '').substring(0, 5);
  };

  // Format datetime to match BlogPostList style
  const formatEventDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status color based on event status
  const getEventStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'primary';
      case 'Ongoing': return 'success';
      case 'Completed': return 'secondary';
      case 'Cancelled': return 'danger';
      default: return 'default';
    }
  };

  // Get event type color
  const getEventTypeColor = (type) => {
    switch (type) {
      case 'Workshop': return 'primary';
      case 'Seminar': return 'secondary';
      case 'Conference': return 'success';
      case 'Social': return 'warning';
      default: return 'default';
    }
  };

  // Get icon for event type
  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'Workshop': return Briefcase;
      case 'Seminar': return Users;
      case 'Conference': return Calendar;
      case 'Social': return MapPin;
      default: return Calendar;
    }
  };

  // Table columns configuration with consistent sorting keys
  const columns = [
    { name: '#ID', uid: 'id', width: '8%', sortable: false },
    { name: 'EVENT NAME', uid: 'name', width: '20%', sortable: false },
    { name: 'ORGANIZER', uid: 'organizer', width: '15%', sortable: false },
    { name: 'TYPE', uid: 'event_type', width: '10%', sortable: false },
    { name: 'DATE', uid: 'datetime', width: '12%', sortable: false, align: 'center' },
    { name: 'STATUS', uid: 'event_status', width: '10%', sortable: false },
    { name: 'PARTICIPANTS', uid: 'totalParticipants', width: '10%', sortable: false},
    { name: 'TOTAL VIEWS', uid: 'views', width: '10%', sortable: false},
    { name: 'ACTIONS', uid: 'actions', width: '15%', sortable: false },
  ];

  // Render cell content based on column type
  const renderCell = (event, columnKey) => {
    const cellValue = event[columnKey];

    switch (columnKey) {
      case 'id':
        return (
          <span className="text-xs font-medium text-gray-400">
            #{formatEventId(cellValue)}
          </span>
        );

      case 'name': {
        const EventTypeIcon = getEventTypeIcon(event.event_type);
        return (
          <Tooltip
            content={
              <div className="max-w-[400px] p-2">
                <p className="font-medium text-small whitespace-pre-line">
                  {formatTooltipText(cellValue)}
                </p>
                {event.description && (
                  <p className="text-tiny text-default-400 mt-2 whitespace-pre-line">
                    {formatTooltipText(event.description)}
                  </p>
                )}
              </div>
            }
            className="bg-default-100"
            showArrow
            placement="top"
          >
            {/* Added container with truncate and max-w to prevent overflow */}
            <div className="flex flex-col truncate max-w-full">
              <p className="text-bold text-small capitalize flex items-center truncate">
                <EventTypeIcon className="mr-2 flex-shrink-0" size={16} />
                {truncateText(cellValue, 10)}
              </p>
              {event.description && (
                <p className="text-bold text-tiny capitalize text-default-400 truncate">
                  {truncateText(event.description, 10)}
                </p>
              )}
            </div>
          </Tooltip>
        );
      }

      case 'organizer':
        return (
          <Tooltip 
            content={<p className="whitespace-pre-line">{formatTooltipText(cellValue)}</p>}
            isDisabled={cellValue.length <= 20}
            showArrow
          >
            <span className="truncate max-w-[150px]">{truncateText(cellValue, 8)}</span>
          </Tooltip>
        );

      case 'event_type':
        const typeColor = getEventTypeColor(cellValue);
        return (
          <Chip
            className="capitalize text-neutral-50"
            color={typeColor}
            size="sm"
            variant="flat"
          >
            {cellValue || 'N/A'}
          </Chip>
        );

        case 'datetime': {
          const formattedDate = formatEventDateTime(cellValue);
          return (
            <Tooltip content={formattedDate} showArrow>
              <span className="text-small whitespace-nowrap">
                {truncateText(formattedDate, 12)}
              </span>
            </Tooltip>
          );
        }
        
        

      case 'event_status':
        const statusColor = getEventStatusColor(cellValue);
        return (
          <Chip
            className="capitalize text-neutral-50"
            color={statusColor}
            size="sm"
            variant="flat"
          >
            {cellValue || 'N/A'}
          </Chip>
        );

      case 'totalParticipants':
        return (
          <div className="flex items-center">
            <Users className="mr-2" size={16} />
            <span>
              {event.totalParticipants || 0} / {event.max_participants || 'N/A'}
            </span>
          </div>
        );

      case 'views':
        return (
          <div className="flex items-center">
            <BarChart2 className="mr-2" size={16} />
            <span>{event.views || 0}</span>
          </div>
        );

      case 'actions':
        return (
          <div className="flex items-center gap-2 justify-center">
            <Tooltip content="View Details">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                onPress={() => onEventAction('view', event)}
              >
                <Eye size={20} />
              </Button>
            </Tooltip>

            <Tooltip content="Edit Event">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                onPress={() => onEventAction('edit', event)}
              >
                <Edit2 size={20} />
              </Button>
            </Tooltip>

            {event.event_status !== 'Cancelled' ? (
              <Tooltip content="Cancel Event">
                <Button 
                  isIconOnly 
                  size="sm" 
                  variant="light" 
                  color="warning" 
                  onPress={() => onEventAction('cancel', event)}
                >
                  <XCircle size={20} />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip content="Make Ongoing">
                <Button 
                  isIconOnly 
                  size="sm" 
                  variant="light" 
                  color="success" 
                  onPress={() => onEventAction('ongoing', event)}
                >
                  <Play size={20} />
                </Button>
              </Tooltip>
            )}

            <Tooltip content="Delete Event">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                color="danger" 
                onPress={() => onEventAction('delete', event)}
              >
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
    // Adding "table-fixed" to enforce fixed layout and ensure columns honor width settings.
    <Table
      aria-label="Event list table"
      className="min-w-full table-fixed"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn 
            key={column.uid} 
            align={column.align || (column.uid === 'actions' ? 'center' : 'start')}
            width={column.width}
            onClick={() => column.sortable && onSort(column.uid)}
            style={{ cursor: column.sortable ? 'pointer' : 'default' }}
            allowsSorting={column.sortable}
          >
            {column.name}
            {sortConfig.key === column.uid && (
              <span className="ml-2">
                {sortConfig.direction === 'ascending' ? '▲' : '▼'}
              </span>
            )}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody 
        items={events}
        emptyContent="No events found"
      >
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

export default EventListTable;
