import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";

const AccessLogsTable = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    // Fetch logs from API or use mock data
    const mockLogs = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      user: `user${i + 1}@example.com`,
      action: ['Login', 'Logout', 'Profile Update', 'Password Change'][Math.floor(Math.random() * 4)],
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }));
    setLogs(mockLogs);
  }, []);

  const pages = Math.ceil(logs.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return logs.slice(start, end);
  }, [page, logs]);

  return (
    <div>
      <Table aria-label="Access logs table">
        <TableHeader>
          <TableColumn>USER</TableColumn>
          <TableColumn>ACTION</TableColumn>
          <TableColumn>TIMESTAMP</TableColumn>
          <TableColumn>IP ADDRESS</TableColumn>
          <TableColumn>USER AGENT</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.user}</TableCell>
              <TableCell>{item.action}</TableCell>
              <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
              <TableCell>{item.ipAddress}</TableCell>
              <TableCell>{item.userAgent}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-4">
        <Pagination
          total={pages}
          page={page}
          onChange={(page) => setPage(page)}
        />
      </div>
    </div>
  );
};

export default AccessLogsTable;