import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, Button } from "@nextui-org/react";
import { Eye, Edit2, Trash2, UserPlus } from "lucide-react";

const StudyGroupListTable = ({ studyGroups, searchTerm, filters, onGroupAction }) => {
  const filteredGroups = studyGroups.filter(group => 
    (group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     group.subject.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!filters.subject || group.subject === filters.subject) &&
    (!filters.university || group.university === filters.university) &&
    (!filters.status || group.status === filters.status)
  );

  const columns = [
    { name: 'NAME', uid: 'name' },
    { name: 'SUBJECT', uid: 'subject' },
    { name: 'UNIVERSITY', uid: 'university' },
    { name: 'MEMBERS', uid: 'members' },
    { name: 'STATUS', uid: 'status' },
    { name: 'ACTIONS', uid: 'actions' },
  ];

  const renderCell = (group, columnKey) => {
    const cellValue = group[columnKey];
    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'lg', src: `https://i.pravatar.cc/150?u=${group.id}` }}
            description={group.subject}
            name={cellValue}
          >
            {group.subject}
          </User>
        );
      case 'status':
        return <Chip color={group.status === 'Active' ? 'success' : 'warning'} size="sm" variant="flat">{cellValue}</Chip>;
      case 'actions':
        return (
          <div className="flex items-center gap-2">
            <Tooltip content={<span className="text-black bg-white dark:text-white dark:bg-black">View Details</span>}>
              <Button isIconOnly size="sm" variant="light" onPress={() => onGroupAction('view', group)}>
                <Eye size={20} />
              </Button>
            </Tooltip>
            <Tooltip content={<span className="text-black bg-white dark:text-white dark:bg-black">Edit Group</span>}>
              <Button isIconOnly size="sm" variant="light" onPress={() => onGroupAction('edit', group)}>
                <Edit2 size={20} />
              </Button>
            </Tooltip>
            <Tooltip content={<span className="text-black bg-white dark:text-white dark:bg-black">Add Members</span>}>
              <Button isIconOnly size="sm" variant="light" onPress={() => onGroupAction('addMembers', group)}>
                <UserPlus size={20} />
              </Button>
            </Tooltip>
            <Tooltip content={<span className="text-black bg-white dark:text-white dark:bg-black">Delete Group</span>}>
              <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => onGroupAction('delete', group)}>
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
    <Table aria-label="Study group list table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={filteredGroups}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default StudyGroupListTable;