import React from "react";
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
} from "@nextui-org/react";
import { Eye, Edit2, Trash2 } from "lucide-react";

const BlogPostListTable = ({
  blogPosts,
  searchTerm,
  filters,
  onPostAction,
  formatDate,
}) => {
  const filteredPosts = blogPosts.filter((post) => {
    // Search filter
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter conditions
    const matchesAuthor = !filters.author || post.author === filters.author;
    const matchesCategory =
      !filters.category || post.category === filters.category;
    const matchesStatus = !filters.status || post.status === filters.status;

    // Date filters
    const postDate = new Date(post.createdAt);
    const matchesStartDate =
      !filters.startDate || postDate >= new Date(filters.startDate);
    const matchesEndDate =
      !filters.endDate || postDate <= new Date(filters.endDate);

    return (
      matchesSearch &&
      matchesAuthor &&
      matchesCategory &&
      matchesStatus &&
      matchesStartDate &&
      matchesEndDate
    );
  });

  const columns = [
    { name: "ID", uid: "id" },
    { name: "TITLE", uid: "title" },
    { name: "AUTHOR", uid: "author" },
    { name: "CATEGORY", uid: "category" },
    { name: "DATE", uid: "createdAt" },
    { name: "STATUS", uid: "status" },
    { name: "VIEWS", uid: "views" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (post, columnKey) => {
    const cellValue = post[columnKey];

    switch (columnKey) {
      case "id":
        return <span className="text-bold text-small">#{cellValue}</span>;

      case "title":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {post.excerpt?.substring(0, 50)}...
            </p>
          </div>
        );

      case "author":
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src={
                  post.author_profile_url || "https://via.placeholder.com/32"
                }
                alt={cellValue}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-bold text-small">{cellValue}</span>
          </div>
        );

      case "category":
        return (
          <Chip color="primary" size="sm" variant="flat">
            {cellValue}
          </Chip>
        );

      case "date":
        return formatDate(cellValue);

      case "status":
        return (
          <Chip
            className="capitalize"
            color={post.status === "Published" ? "success" : "warning"}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );

      case "views":
        return (
          <span className="text-bold text-small">
            {cellValue} view{cellValue !== 1 ? "s" : ""}
          </span>
        );

      case "actions":
        return (
          <div className="flex items-center gap-2 justify-end">
            <Tooltip content="View Details">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onPostAction("view", post)}
                className="text-default-400 hover:text-default-900"
              >
                <Eye size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Edit Post">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onPostAction("edit", post)}
                className="text-default-400 hover:text-default-900"
              >
                <Edit2 size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Delete Post">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={() => onPostAction("delete", post)}
                className="text-danger hover:text-danger-500"
              >
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
    <Table
      aria-label="Blog post list table"
      classNames={{
        wrapper: "shadow-md rounded-lg",
        table: "min-h-[400px]",
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "end" : "start"}
            className="text-small uppercase"
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={filteredPosts}
        emptyContent={
          <div className="text-center text-default-400">
            {searchTerm || Object.values(filters).some(Boolean)
              ? "No posts match the current filters"
              : "No posts available"}
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

export default BlogPostListTable;

