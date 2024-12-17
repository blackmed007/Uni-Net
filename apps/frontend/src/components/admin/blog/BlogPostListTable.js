import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, Button } from "@nextui-org/react";
import { Eye, Edit2, Trash2 } from "lucide-react";

const BlogPostListTable = ({ blogPosts, searchTerm, filters, onPostAction, formatDate }) => {
  const filteredPosts = blogPosts.filter(post => 
    (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     post.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!filters.author || post.author === filters.author) &&
    (!filters.category || post.category === filters.category) &&
    (!filters.status || post.status === filters.status)
  );

  const columns = [
    { name: 'ID', uid: 'id' },
    { name: 'TITLE', uid: 'title' },
    { name: 'AUTHOR', uid: 'author' },
    { name: 'CATEGORY', uid: 'category' },
    { name: 'DATE', uid: 'date' },
    { name: 'STATUS', uid: 'status' },
    { name: 'VIEWS', uid: 'views' },
    { name: 'ACTIONS', uid: 'actions' },
  ];

  const renderCell = (post, columnKey) => {
    const cellValue = post[columnKey];
    switch (columnKey) {
      case 'id':
        return <span className="text-bold text-small">#{cellValue}</span>;
      case 'title':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{post.excerpt.substring(0, 50)}...</p>
          </div>
        );
      case 'category':
        return <Chip color="primary" size="sm" variant="flat">{cellValue}</Chip>;
      case 'date':
        return formatDate(cellValue);
      case 'status':
        return (
          <Chip
            className="capitalize"
            color={post.status === 'Published' ? 'success' : post.status === 'Draft' ? 'warning' : 'danger'}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case 'views':
        return cellValue;
      case 'actions':
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="View Details">
              <Button isIconOnly size="sm" variant="light" onPress={() => onPostAction('view', post)}>
                <Eye size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Edit Post">
              <Button isIconOnly size="sm" variant="light" onPress={() => onPostAction('edit', post)}>
                <Edit2 size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Delete Post">
              <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => onPostAction('delete', post)}>
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
    <Table aria-label="Blog post list table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={filteredPosts}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default BlogPostListTable;