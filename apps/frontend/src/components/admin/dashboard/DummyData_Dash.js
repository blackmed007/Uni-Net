// src/components/admin/dashboard/DummyData.js

export const activityData = [
    { name: 'Jan', users: 400, events: 240, studyGroups: 240 },
    { name: 'Feb', users: 300, events: 139, studyGroups: 221 },
    { name: 'Mar', users: 200, events: 980, studyGroups: 229 },
    { name: 'Apr', users: 278, events: 390, studyGroups: 200 },
    { name: 'May', users: 189, events: 480, studyGroups: 218 },
    { name: 'Jun', users: 239, events: 380, studyGroups: 250 },
    { name: 'Jul', users: 349, events: 430, studyGroups: 210 },
  ];
  
  export const engagementData = [
    { name: 'Jan', engagement: 65 },
    { name: 'Feb', engagement: 59 },
    { name: 'Mar', engagement: 80 },
    { name: 'Apr', engagement: 72 },
    { name: 'May', engagement: 76 },
    { name: 'Jun', engagement: 82 },
    { name: 'Jul', engagement: 79 },
  ];
  
  export const recentActivityData = [
    { icon: 'UserPlus', text: "New user registered: Sarah Johnson", time: "2 minutes ago", type: "user" },
    { icon: 'Calendar', text: "Event created: Web Development Workshop", time: "1 hour ago", type: "event" },
    { icon: 'MessageCircle', text: "New forum post: 'Tips for Effective Studying'", time: "3 hours ago", type: "forum" },
    { icon: 'BookOpen', text: "Study group 'Advanced Mathematics' reached 20 members", time: "5 hours ago", type: "studyGroup" },
  ];
  
  export const summaryData = [
    { title: "Total Users", value: "1,234", icon: "Users", trend: 5.2, color: "blue" },
    { title: "Active Study Groups", value: "42", icon: "BookOpen", trend: 3.7, color: "green" },
    { title: "Engagement Rate", value: "78%", icon: "Target", trend: 1.4, color: "yellow" },
  ];
  
  export const userDistributionData = [
    { name: 'Students', value: 400 },
    { name: 'Teachers', value: 300 },
    { name: 'Admins', value: 50 },
    { name: 'Guests', value: 100 },
  ];