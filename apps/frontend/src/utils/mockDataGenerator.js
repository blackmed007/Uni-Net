// mockDataGenerator.js

const generateMockUsers = () => {
  return [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Student',
      university: 'Example University',
      city: 'Example City',
      gender: 'Male',
      status: 'Active',
      profileCompleted: true,
      registrationDate: '2023-01-01'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Student',
      university: 'Another University',
      city: 'Another City',
      gender: 'Female',
      status: 'Active',
      profileCompleted: true,
      registrationDate: '2023-02-01'
    },
    // Add more mock users as needed
  ];
};

const generateMockStudyGroups = () => {
  return [
    {
        id: 1,
        name: 'Advanced Mathematics',
        subject: 'Mathematics',
        university: 'Example University',
        description: 'A group for advanced math enthusiasts',
        members: [1], // Ensure this is always an array
        status: 'Active',
        createdBy: 1,
        createdOn: '2023-03-01'
    },
    {
      id: 2,
      name: 'Web Development Club',
      subject: 'Computer Science',
      university: 'Another University',
      description: 'Learn and practice web development skills',
      members: [1, 2], // User IDs
      status: 'Active',
      createdBy: 2, // User ID
      createdOn: '2023-03-15'
    },
    // Add more mock study groups as needed
  ];
};

const generateMockEvents = () => {
  return [
    {
        id: 1,
        name: 'Web Development Workshop',
        description: 'Learn the basics of web development',
        date: '2023-07-15',
        time: '14:00',
        location: 'Online',
        organizer: 'Tech Society',
        type: 'Workshop',
        status: 'Upcoming',
        participants: [1], // Ensure this is always an array
        maxParticipants: 50
    },
    {
      id: 2,
      name: 'Math Olympiad',
      description: 'Annual mathematics competition',
      date: '2023-08-01',
      time: '09:00',
      location: 'Main Hall, Example University',
      organizer: 'Math Department',
      type: 'Competition',
      status: 'Open',
      participants: [1, 2], // User IDs
      maxParticipants: 100
    },
    // Add more mock events as needed
  ];
};

const generateMockBlogPosts = () => {
  return [
    {
      id: 1,
      title: 'Tips for Effective Studying',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'John Doe',
      date: '2023-04-01',
      category: 'Study Tips',
      status: 'Published'
    },
    {
      id: 2,
      title: 'Balancing Academics and Social Life',
      content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
      author: 'Jane Smith',
      date: '2023-04-15',
      category: 'Student Life',
      status: 'Published'
    },
    // Add more mock blog posts as needed
  ];
};

const generateMockNotifications = () => {
  return [
    {
      id: 1,
      title: 'New Event: Web Development Workshop',
      message: 'A new web development workshop has been scheduled. Check it out!',
      type: 'Event',
      recipients: ['all'],
      read: false,
      date: '2023-06-01T10:00:00Z'
    },
    {
      id: 2,
      title: 'Study Group Invitation',
      message: 'You have been invited to join the Advanced Mathematics study group.',
      type: 'Group',
      recipients: [1], // User IDs
      read: false,
      date: '2023-06-02T14:30:00Z'
    },
    // Add more mock notifications as needed
  ];
};

const initializeMockData = () => {
  localStorage.setItem('users', JSON.stringify(generateMockUsers()));
  localStorage.setItem('studyGroups', JSON.stringify(generateMockStudyGroups()));
  localStorage.setItem('events', JSON.stringify(generateMockEvents()));
  localStorage.setItem('blogPosts', JSON.stringify(generateMockBlogPosts()));
  localStorage.setItem('notifications', JSON.stringify(generateMockNotifications()));
};

export { initializeMockData, generateMockUsers, generateMockStudyGroups, generateMockEvents, generateMockBlogPosts, generateMockNotifications };
