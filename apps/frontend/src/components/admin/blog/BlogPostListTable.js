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
  isLoading
}) => {
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

  const formatBlogId = (id) => {
    return id.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const formatTooltipText = (text, maxLength = 90, lineLength = 30) => {
    if (!text) return '';
    const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    
    // Insert line breaks every `lineLength` characters
    return truncatedText.replace(new RegExp(`(.{1,${lineLength}})`, 'g'), '$1\n');
  };

  const formatBlogDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderCell = (post, columnKey) => {
    const cellValue = post[columnKey];

    switch (columnKey) {
      case "id":
        return <span className="text-bold text-small">#{formatBlogId(cellValue)}</span>;

      case "title":
        return (
          <Tooltip
            content={
              <div className="max-w-[400px] p-2">
                <p className="font-medium text-small whitespace-pre-line">{formatTooltipText(cellValue)}</p>
                {post.excerpt && (
                  <p className="text-tiny text-default-400 mt-2 whitespace-pre-line">
                    {formatTooltipText(post.excerpt)}
                  </p>
                )}
              </div>
            }
            className="bg-default-100"
            showArrow
            placement="top"
          >
            <div className="flex flex-col max-w-[300px] overflow-hidden">
              <p className="text-small font-medium truncate max-w-full">
                {truncateText(cellValue, 20)}
              </p>
              {post.excerpt && (
                <p className="text-tiny text-default-400 truncate max-w-full">
                  {truncateText(post.excerpt, 10)}
                </p>
              )}
            </div>
          </Tooltip>
        );

      case "author":
        return (
          <Tooltip 
            content={<p className="whitespace-pre-line">{formatTooltipText(cellValue)}</p>}
            isDisabled={cellValue.length <= 50}
            showArrow
          >
            <User
              avatarProps={{
                radius: "lg",
                size: "sm",
                src: post.author_profile_url || "https://via.placeholder.com/32",
                className: "bg-gray-700"
              }}
              classNames={{
                name: "text-small line-clamp-2 max-w-[200px]",
              }}
              name={truncateText(cellValue, 15)}
            />
          </Tooltip>
        );

      case "category":
        return (
          <Tooltip 
            content={<p className="whitespace-pre-line">{formatTooltipText(cellValue)}</p>}
            isDisabled={cellValue.length <= 50}
            showArrow
          >
            <Chip 
              color="primary" 
              size="sm" 
              variant="flat"
              classNames={{
                content: "line-clamp-2 max-w-[150px]"
              }}
            >
              {truncateText(cellValue, 15)}
            </Chip>
          </Tooltip>
        );

      case "createdAt":
        return <span className="text-small whitespace-nowrap">{formatBlogDate(cellValue)}</span>;

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
          <span className="text-small whitespace-nowrap">
            {cellValue} view{cellValue !== 1 ? "s" : ""}
          </span>
        );

      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="View Details" showArrow>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onPostAction("view", post)}
                className="text-default-400 hover:text-default-900"
              >
                <Eye size={18} />
              </Button>
            </Tooltip>
            <Tooltip content="Edit Post" showArrow>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onPostAction("edit", post)}
                className="text-default-400 hover:text-default-900"
              >
                <Edit2 size={18} />
              </Button>
            </Tooltip>
            <Tooltip content="Delete Post" showArrow>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={() => onPostAction("delete", post)}
                className="text-danger hover:text-danger-500"
              >
                <Trash2 size={18} />
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
      selectionMode="none"
      classNames={{
        wrapper: "min-h-[222px]",
        td: "py-3", 
      }}
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
            align={column.uid === "actions" ? "end" : "start"}
            className="text-small uppercase"
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={blogPosts}
        emptyContent={
          <div className="text-center text-default-400">
            No blog posts found
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