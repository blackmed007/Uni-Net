import React, { useState, useEffect } from 'react';
import { NextUIProvider, Input, Button, Tabs, Tab } from "@nextui-org/react";
import { Search, Filter, TrendingUp, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Masonry from 'react-masonry-css';
import StudyGroupCard from '../../components/user/studyGroups/StudyGroupCard';
import StudyGroupDetailsModal from '../../components/user/studyGroups/StudyGroupDetailsModal';
import StudyGroupFilterModal from '../../components/user/studyGroups/StudyGroupFilterModal';

const UserStudyGroupsPage = () => {
  const [user, setUser] = useState(null);
  const [studyGroups, setStudyGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    subject: '',
    university: '',
    studyYear: '',
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    setUser(userData);

    const storedGroups = JSON.parse(localStorage.getItem('studyGroups') || '[]');
    setStudyGroups(storedGroups);
  }, []);

  useEffect(() => {
    const filtered = studyGroups.filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            group.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            group.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSubject = !filters.subject || group.subject === filters.subject;
      const matchesUniversity = !filters.university || group.university === filters.university;
      const matchesStudyYear = !filters.studyYear || group.studyYear.toString() === filters.studyYear;

      const matchesTab = activeTab === 'all' || 
                         (activeTab === 'joined' && Array.isArray(group.members) && group.members.includes(user?.id));

      return matchesSearch && matchesSubject && matchesUniversity && matchesStudyYear && matchesTab;
    });

    setFilteredGroups(filtered);
  }, [searchTerm, studyGroups, activeTab, filters, user]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = (group) => {
    setSelectedGroup(group);
    setIsDetailsModalOpen(true);
  };

  const handleJoinGroup = (groupId) => {
    const updatedGroups = studyGroups.map(group => {
      if (group.id === groupId) {
        const updatedMembers = Array.isArray(group.members) ? [...group.members, user.id] : [user.id];
        return { ...group, members: updatedMembers };
      }
      return group;
    });
    setStudyGroups(updatedGroups);
    localStorage.setItem('studyGroups', JSON.stringify(updatedGroups));
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <NextUIProvider>
      <div className="space-y-6 p-6 bg-black min-h-screen text-white pt-24">
      <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="bg-gradient-to-r from-purple-800 to-blue-800 p-6 rounded-lg shadow-md mb-8"
>
  <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
    Study Groups
  </h1>
  <p className="mb-4 text-white">
    Join study groups, collaborate, and excel in your studies!
  </p>
  <div className="flex space-x-4">
    <Button color="secondary" startContent={<TrendingUp size={20} />}>
      Trending Groups
    </Button>
  </div>
</motion.div>


        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Input
            placeholder="Search study groups..."
            value={searchTerm}
            onChange={handleSearch}
            startContent={<Search className="text-gray-400" size={20} />}
            className="w-full sm:w-1/2"
          />
          <Button color="primary" onPress={() => setIsFilterModalOpen(true)} startContent={<Filter size={20} />}>
            Filters
          </Button>
        </div>

        <Tabs 
          aria-label="Study group categories" 
          selectedKey={activeTab} 
          onSelectionChange={setActiveTab}
          className="mb-6"
          color="secondary"
          variant="underlined"
        >
          <Tab key="all" title="All Groups" />
          <Tab key="joined" title="Joined Groups" />
        </Tabs>

        <AnimatePresence>
          {filteredGroups.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-10"
            >
              <Users size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-500">No study groups found. Create or join a group to get started!</p>
            </motion.div>
          ) : (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex w-auto -ml-4"
              columnClassName="pl-4 bg-clip-padding"
            >
              {filteredGroups.map(group => (
                <div key={group.id} className="mb-4">
                  <StudyGroupCard 
                    group={group} 
                    onViewDetails={() => handleViewDetails(group)}
                    onJoin={() => handleJoinGroup(group.id)}
                    isJoined={Array.isArray(group.members) && group.members.includes(user?.id)}
                  />
                </div>
              ))}
            </Masonry>
          )}
        </AnimatePresence>

        <StudyGroupDetailsModal
          group={selectedGroup}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onJoin={() => selectedGroup && handleJoinGroup(selectedGroup.id)}
          isJoined={selectedGroup && Array.isArray(selectedGroup.members) && selectedGroup.members.includes(user?.id)}
        />
        <StudyGroupFilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={setFilters}
          initialFilters={filters}
        />
      </div>
    </NextUIProvider>
  );
};

export default UserStudyGroupsPage;