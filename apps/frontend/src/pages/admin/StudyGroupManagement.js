import React from 'react';
import { Input, Button } from "@nextui-org/react";
import { Search, Filter, Plus, Users, BookOpen, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const StudyGroupManagement = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({
    subject: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  // Table headers to show the structure
  const columns = [
    { name: 'ID', uid: 'id', width: '80px' },
    { name: 'GROUP NAME', uid: 'name', width: '25%' },
    { name: 'SUBJECT', uid: 'subject', width: '120px' },
    { name: 'CREATED DATE', uid: 'date', width: '200px' },
    { name: 'STATUS', uid: 'status', width: '120px' },
    { name: 'MEMBERS', uid: 'members', width: '120px' },
    { name: 'ACTIONS', uid: 'actions', width: '180px' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Study Group Management</h1>
      
      {/* Search and buttons section */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Input
          placeholder="Search study groups..."
          value={searchTerm}
          onChange={handleSearch}
          startContent={<Search className="text-gray-400" size={20} />}
          className="w-full sm:w-1/2"
        />
        <Button color="primary" startContent={<Filter size={20} />}>
          Filters
        </Button>
        <Button 
          color="success" 
          startContent={<Plus size={20} />}
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white"
        >
          Create Study Group
        </Button>
      </div>

      {/* Coming soon section with table header */}
      <div className="relative min-h-[60vh] w-full">
        {/* Show table header */}
        <div className="absolute top-0 w-full z-20">
          <table className="min-w-full">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th 
                    key={column.uid}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: column.width }}
                  >
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>

        {/* Blur overlay */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
        
        {/* Coming soon content */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center text-white z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                }}
                className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl"
              />
              <div className="relative flex space-x-4">
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl backdrop-blur-sm border border-white/10"
                >
                  <Users size={48} className="text-purple-400" />
                </motion.div>
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl backdrop-blur-sm border border-white/10"
                >
                  <BookOpen size={48} className="text-blue-400" />
                </motion.div>
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="p-4 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl backdrop-blur-sm border border-white/10"
                >
                  <GraduationCap size={48} className="text-pink-400" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.h1 
            className="text-7xl font-bold mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Coming Soon
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <p className="text-xl text-gray-300 leading-relaxed">
              We're building a comprehensive study group management system to enhance collaborative learning.
              Check back soon for exciting features!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {[
                { icon: Users, text: "Group Collaboration", color: "text-purple-400" },
                { icon: BookOpen, text: "Resource Sharing", color: "text-blue-400" },
                { icon: GraduationCap, text: "Progress Tracking", color: "text-pink-400" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.2 }}
                  className="p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10"
                >
                  <item.icon className={`mx-auto mb-2 ${item.color}`} size={24} />
                  <p className="text-sm text-gray-300">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudyGroupManagement;