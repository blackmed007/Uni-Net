import { Calendar, Users, Video, Mic, Globe } from "lucide-react";

export const getEventStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'ongoing':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'completed':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const getEventTypeIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'workshop':
      return Users;
    case 'webinar':
      return Video;
    case 'conference':
      return Mic;
    case 'seminar':
      return Globe;
    default:
      return Calendar;
  }
};

export const getRemainingTime = (date, time) => {
  const eventDate = new Date(`${date}T${time}`);
  const now = new Date();
  const diff = eventDate - now;

  if (diff < 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
  return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
};

export const filterEvents = (events, searchTerm, filters) => {
  return events.filter(event => 
    (event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     event.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!filters.type || event.type === filters.type) &&
    (!filters.status || event.status === filters.status) &&
    (!filters.date || event.date === filters.date)
  );
};

export const sortEvents = (events, sortKey, sortDirection) => {
  return [...events].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortDirection === 'ascending' ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortDirection === 'ascending' ? 1 : -1;
    return 0;
  });
};