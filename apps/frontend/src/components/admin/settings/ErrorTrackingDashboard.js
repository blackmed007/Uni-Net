import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ErrorTrackingDashboard = () => {
  const [errorLogs, setErrorLogs] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [filter, setFilter] = useState({ severity: 'all', search: '' });

  useEffect(() => {
    // Fetch error logs and performance metrics from API or use mock data
    const mockErrorLogs = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      message: `Error ${i + 1}: ${['Database connection failed', '404 Not Found', 'Null pointer exception', 'API timeout'][Math.floor(Math.random() * 4)]}`,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      severity: ['Critical', 'Warning', 'Info'][Math.floor(Math.random() * 3)],
      stackTrace: 'at ErrorTrackingDashboard.js:42\nat renderWithHooks()\nat updateFunctionComponent()',
    }));
    setErrorLogs(mockErrorLogs);

    const mockPerformanceMetrics = [
      { name: 'CPU Usage', value: 65 },
      { name: 'Memory Usage', value: 80 },
      { name: 'Disk I/O', value: 45 },
      { name: 'Network Traffic', value: 70 },
    ];
    setPerformanceMetrics(mockPerformanceMetrics);

    // Simulated real-time updates
    const interval = setInterval(() => {
      setErrorLogs(prevLogs => [
        {
          id: prevLogs.length + 1,
          message: `New Error: ${['Database connection failed', '404 Not Found', 'Null pointer exception', 'API timeout'][Math.floor(Math.random() * 4)]}`,
          timestamp: new Date().toISOString(),
          severity: ['Critical', 'Warning', 'Info'][Math.floor(Math.random() * 3)],
          stackTrace: 'at ErrorTrackingDashboard.js:42\nat renderWithHooks()\nat updateFunctionComponent()',
        },
        ...prevLogs.slice(0, 19)
      ]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = errorLogs.filter(log => 
    (filter.severity === 'all' || log.severity === filter.severity) &&
    (log.message.toLowerCase().includes(filter.search.toLowerCase()) ||
     log.severity.toLowerCase().includes(filter.search.toLowerCase()))
  );

  const handleIntegration = () => {
    // Logic to integrate with issue tracking tools (e.g., Jira, GitHub)
    console.log('Integrating with issue tracking tool...');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">Error Logs</h3>
        </CardHeader>
        <CardBody>
          <div className="flex space-x-4 mb-4">
            <Select 
              placeholder="Filter by severity"
              onChange={(e) => setFilter(prev => ({ ...prev, severity: e.target.value }))}
            >
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="Warning">Warning</SelectItem>
              <SelectItem value="Info">Info</SelectItem>
            </Select>
            <Input
              placeholder="Search errors..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <Table aria-label="Error logs table">
            <TableHeader>
              <TableColumn>MESSAGE</TableColumn>
              <TableColumn>TIMESTAMP</TableColumn>
              <TableColumn>SEVERITY</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.message}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      log.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                      log.severity === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {log.severity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" color="primary" onClick={() => console.log('View details', log)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">Performance Metrics</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Button color="primary" onPress={handleIntegration}>
        Integrate with Issue Tracking Tool
      </Button>
    </div>
  );
};

export default ErrorTrackingDashboard;