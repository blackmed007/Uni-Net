import React, { useState, useEffect } from 'react';
import { Input, Button, useDisclosure } from "@nextui-org/react";
import { Search, Filter, Plus } from "lucide-react";
import StudyGroupListTable from '../../components/admin/studyGroup/StudyGroupListTable';
import StudyGroupDetailModal from '../../components/admin/studyGroup/StudyGroupDetailModal';
import StudyGroupFilterModal from '../../components/admin/studyGroup/StudyGroupFilterModal';
import CreateStudyGroupModal from '../../components/admin/studyGroup/CreateStudyGroupModal';
import EditStudyGroupModal from '../../components/admin/studyGroup/EditStudyGroupModal';
import ConfirmActionModal from '../../components/common/ConfirmActionModal';

const StudyGroupManagement = () => {
  const [studyGroups, setStudyGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    subject: '',
    university: '',
    status: '',
  });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [actionType, setActionType] = useState('');
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const { isOpen: isGroupDetailOpen, onOpen: onGroupDetailOpen, onClose: onGroupDetailClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();

  useEffect(() => {
    // Fetch study groups from API or local storage
    const storedGroups = localStorage.getItem('studyGroups');
    if (storedGroups) {
      setStudyGroups(JSON.parse(storedGroups));
    }
  }, []);

  const saveStudyGroups = (updatedGroups) => {
    setStudyGroups(updatedGroups);
    localStorage.setItem('studyGroups', JSON.stringify(updatedGroups));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    onFilterClose();
  };

  const handleGroupAction = (action, group) => {
    setSelectedGroup(group);
    setActionType(action);
    switch (action) {
      case 'view':
        onGroupDetailOpen();
        break;
      case 'edit':
        onEditOpen();
        break;
      case 'delete':
        onConfirmOpen();
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleConfirmAction = () => {
    if (actionType === 'delete') {
      const updatedGroups = studyGroups.filter(group => group.id !== selectedGroup.id);
      saveStudyGroups(updatedGroups);
    }
    onConfirmClose();
  };

  const handleEditGroup = (updatedGroup) => {
    const updatedGroups = studyGroups.map(group => 
      group.id === updatedGroup.id ? updatedGroup : group
    );
    saveStudyGroups(updatedGroups);
    onEditClose();
  };

  const handleCreateGroup = (newGroup) => {
    const groupWithId = { ...newGroup, id: Date.now() };
    const updatedGroups = [...studyGroups, groupWithId];
    saveStudyGroups(updatedGroups);
    onCreateClose();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Study Group Management</h1>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Input
          placeholder="Search study groups..."
          value={searchTerm}
          onChange={handleSearch}
          startContent={<Search className="text-gray-400" size={20} />}
          className="w-full sm:w-1/2"
        />
        <Button color="primary" onPress={onFilterOpen} startContent={<Filter size={20} />}>
          Filters
        </Button>
        <Button 
          color="success" 
          onPress={onCreateOpen} 
          startContent={<Plus size={20} />}
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white"
        >
          Create Study Group
        </Button>
      </div>
      <StudyGroupListTable
        studyGroups={studyGroups}
        searchTerm={searchTerm}
        filters={filters}
        onGroupAction={handleGroupAction}
      />
      <StudyGroupDetailModal
        isOpen={isGroupDetailOpen}
        onClose={onGroupDetailClose}
        group={selectedGroup}
      />
      <StudyGroupFilterModal
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        onApplyFilters={handleFilter}
        initialFilters={filters}
      />
      <CreateStudyGroupModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSave={handleCreateGroup}
      />
      <EditStudyGroupModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        group={selectedGroup}
        onSave={handleEditGroup}
      />
      <ConfirmActionModal
        isOpen={isConfirmOpen}
        onClose={onConfirmClose}
        onConfirm={handleConfirmAction}
        actionType={actionType}
      />
    </div>
  );
};

export default StudyGroupManagement;