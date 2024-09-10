import React, { useState, useEffect } from 'react';
import { NextUIProvider } from "@nextui-org/react";
import StudyGroupsList from '../../components/user/studyGroups/StudyGroupsList';

const UserStudyGroupsPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    setUser(userData);
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <NextUIProvider>
      <div>
        <h1 className="text-4xl font-bold mb-6">Study Groups</h1>
        <StudyGroupsList userId={user.id} />
      </div>
    </NextUIProvider>
  );
};

export default UserStudyGroupsPage;