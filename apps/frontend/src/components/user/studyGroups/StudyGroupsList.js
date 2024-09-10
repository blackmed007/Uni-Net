import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Input, Button } from "@nextui-org/react";
import { Search } from "lucide-react";
import StudyGroupCard from './StudyGroupCard';
import StudyGroupDetailsModal from './StudyGroupDetailsModal';

const StudyGroupsList = ({ userId }) => {
  const [studyGroups, setStudyGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Fetch study groups from localStorage or API
    const storedGroups = JSON.parse(localStorage.getItem('studyGroups') || '[]');
    setStudyGroups(storedGroups);
    setFilteredGroups(storedGroups);
  }, []);

  useEffect(() => {
    const filtered = studyGroups.filter(group => 
      (group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeTab === 'all' || (activeTab === 'joined' && Array.isArray(group.members) && group.members.includes(userId)))
    );
    setFilteredGroups(filtered);
  }, [searchTerm, studyGroups, activeTab, userId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = (group) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
  };

  const handleJoinGroup = (groupId) => {
    // Implement join group functionality
    console.log(`User ${userId} joined group ${groupId}`);
    // Update the group in the state and localStorage
    const updatedGroups = studyGroups.map(group => {
      if (group.id === groupId) {
        const updatedMembers = Array.isArray(group.members) ? [...group.members, userId] : [userId];
        return { ...group, members: updatedMembers };
      }
      return group;
    });
    setStudyGroups(updatedGroups);
    localStorage.setItem('studyGroups', JSON.stringify(updatedGroups));
  };

  return (
    <div>
      <Tabs selectedKey={activeTab} onSelectionChange={setActiveTab}>
        <Tab key="all" title="All Groups" />
        <Tab key="joined" title="Joined Groups" />
      </Tabs>
      <Input
        placeholder="Search study groups..."
        value={searchTerm}
        onChange={handleSearch}
        startContent={<Search className="text-gray-400" size={20} />}
        className="my-4"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredGroups.map(group => (
          <StudyGroupCard 
            key={group.id}
            group={group} 
            onViewDetails={() => handleViewDetails(group)}
            onJoin={() => handleJoinGroup(group.id)}
            isJoined={Array.isArray(group.members) && group.members.includes(userId)}
          />
        ))}
      </div>
      <StudyGroupDetailsModal
        group={selectedGroup}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onJoin={() => selectedGroup && handleJoinGroup(selectedGroup.id)}
        isJoined={selectedGroup && Array.isArray(selectedGroup.members) && selectedGroup.members.includes(userId)}
      />
    </div>
  );
};

export default StudyGroupsList;