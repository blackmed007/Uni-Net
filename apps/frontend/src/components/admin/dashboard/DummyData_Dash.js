// src/components/admin/dashboard/DummyData_Dash.js

import { getLastSevenMonths } from '../../../utils/dateUtils';

const lastSevenMonths = getLastSevenMonths();

export const activityData = lastSevenMonths.map((month, index) => ({
    name: month.name,
    fullName: month.fullName,
    year: month.year,
    users: [400, 300, 200, 278, 189, 239, 349][index],
    events: [240, 139, 980, 390, 480, 380, 430][index],
    blogPosts: [180, 165, 190, 210, 230, 250, 270][index]
}));

export const engagementData = lastSevenMonths.map((month, index) => ({
    name: month.name,
    fullName: month.fullName,
    year: month.year,
    engagement: [65, 59, 80, 72, 76, 82, 79][index]
}));

export const recentActivityData = [
    { icon: 'UserPlus', text: "New user registered: Sarah Johnson", time: "2 minutes ago", type: "user" },
    { icon: 'Calendar', text: "Event created: Web Development Workshop", time: "1 hour ago", type: "event" },
    { icon: 'MessageCircle', text: "New blog post published: 'Learning Strategies'", time: "3 hours ago", type: "blog" },
    { icon: 'BookOpen', text: "Blog post 'Advanced Mathematics' bookmarked 50 times", time: "5 hours ago", type: "blogPost" },
];

export const summaryData = [
    { title: "Total Users", value: "1,234", icon: "Users", trend: 5.2, color: "blue" },
    { title: "Bookmarked Blog Posts", value: "156", icon: "BookOpen", trend: 8.4, color: "green" },
    { title: "Engagement Rate", value: "78%", icon: "Target", trend: 1.4, color: "yellow" },
];

export const userDistributionData = {
    genders: [
        { name: 'Male', value: 550 },
        { name: 'Female', value: 450 }
    ],
    roles: [
        { name: 'Users', value: 800 },
        { name: 'Admins', value: 50 },
        { name: 'Guests', value: 150 }
    ]
};
