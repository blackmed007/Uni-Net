import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Input } from "@nextui-org/react";
import { Search } from "lucide-react";

const AccessLogsTable = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 10;

  useEffect(() => {
    // Mock data remains for design purposes
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

  const filteredLogs = logs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ipAddress.includes(searchTerm)
  );

  const pages = Math.ceil(filteredLogs.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredLogs.slice(start, end);
  }, [page, filteredLogs]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Access Logs</h2>
      </div>
      
      <div className="mt-2 p-2 bg-gray-800 rounded-lg">
        <p className="text-sm text-yellow-400">Enhanced Security Monitoring - Coming in Next Release</p>
        <ul className="text-sm text-gray-300 mt-1 ml-4 list-disc">
          <li>Detailed user access tracking and monitoring</li>
          <li>Real-time security alerts and notifications</li>
          <li>Advanced filtering and reporting capabilities</li>
          <li>IP-based access control and geographic tracking</li>
        </ul>
      </div>

      <Input
        placeholder="Search logs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        startContent={<Search className="text-default-400" size={16} />}
        className="max-w-xs mb-4"
        isDisabled
      />
      
      <Table 
        aria-label="Access logs table"
        className="opacity-50 pointer-events-none"
      >
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
          isDisabled
        />
      </div>
    </div>
  );
};

export default AccessLogsTable;