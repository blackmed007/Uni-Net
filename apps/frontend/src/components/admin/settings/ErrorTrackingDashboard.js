import React, { useState, useEffect } from 'react';
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, AlertTriangle, ArrowRight } from "lucide-react";

const ErrorTrackingDashboard = () => {
  const [errorLogs, setErrorLogs] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [filter, setFilter] = useState({ severity: 'all', search: '' });

  useEffect(() => {
    // Mock data remains for design purposes
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
  }, []);

  const filteredLogs = errorLogs.filter(log => 
    (filter.severity === 'all' || log.severity === filter.severity) &&
    (log.message.toLowerCase().includes(filter.search.toLowerCase()) ||
     log.severity.toLowerCase().includes(filter.search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Error Tracking Dashboard</h2>
      </div>

      <div className="mt-2 p-2 bg-gray-800 rounded-lg">
        <p className="text-sm text-yellow-400">Advanced Error Monitoring System - Launching Soon</p>
        <ul className="text-sm text-gray-300 mt-1 ml-4 list-disc">
          <li>Real-time error detection and alerting</li>
          <li>Automated error categorization and priority assignment</li>
          <li>Performance metrics and trend analysis</li>
          <li>Integration with popular issue tracking tools</li>
          <li>Customizable dashboard and reporting features</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Input
          placeholder="Search errors..."
          value={filter.search}
          onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
          startContent={<Search className="text-default-400" size={16} />}
          className="w-full sm:w-1/2"
          isDisabled
        />
        <Select 
          placeholder="Filter by severity"
          selectedKeys={[filter.severity]}
          onChange={(e) => setFilter(prev => ({ ...prev, severity: e.target.value }))}
          className="w-full sm:w-1/2"
          isDisabled
        >
          <SelectItem key="all" value="all">All Severities</SelectItem>
          <SelectItem key="Critical" value="Critical">Critical</SelectItem>
          <SelectItem key="Warning" value="Warning">Warning</SelectItem>
          <SelectItem key="Info" value="Info">Info</SelectItem>
        </Select>
      </div>

      <Card className="opacity-50 pointer-events-none">
        <CardBody>
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
                    <Button size="sm" color="primary" endContent={<ArrowRight size={16} />}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Card className="opacity-50 pointer-events-none">
        <CardBody>
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
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

      <Button 
        color="primary" 
        startContent={<AlertTriangle size={16} />}
        isDisabled
      >
        Integrate with Issue Tracking Tool
      </Button>
    </div>
  );
};

export default ErrorTrackingDashboard;