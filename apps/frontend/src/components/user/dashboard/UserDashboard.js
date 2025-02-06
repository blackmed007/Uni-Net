import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button, Chip } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Users, BookOpen, Target, Bookmark, Calendar } from "lucide-react";
import UsersAPI from "../../../services/users.api";

const UserDashboard = ({
  user,
  studyGroups,
  events,
  NotificationsList,
  JoinedStudyGroups,
  RegisteredEvents,
  RecentActivity,
}) => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [userMetrics, setUserMetrics] = useState({
    registerd_events: 0,
    bookmarked_posts: 0,
    engagement_rate: 0,
  });

  useEffect(() => {
    const storedBookmarks = JSON.parse(
      localStorage.getItem("bookmarkedPosts") || "[]",
    );
    const storedPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    const bookmarked = storedPosts.filter((post) =>
      storedBookmarks.includes(post.id),
    );
    setBookmarkedPosts(bookmarked);

    const fetchMetrics = async () => {
      const _userMetrics = await UsersAPI.getUserMetrics();
      console.log(_userMetrics);
      setUserMetrics(_userMetrics);
    };

    fetchMetrics();
  }, [user.id]);

  const joinedGroups = studyGroups.filter(
    (group) => Array.isArray(group.members) && group.members.includes(user.id),
  );

  const registeredEvents = events;

  const SummaryCard = ({ title, value, icon: Icon, trend, color }) => {
    const config = {
      blue: {
        gradient: "from-blue-600 to-blue-700",
        trendUp: "text-blue-200",
        trendDown: "text-blue-300",
      },
      purple: {
        gradient: "from-purple-600 to-purple-700",
        trendUp: "text-purple-200",
        trendDown: "text-purple-300",
      },
      green: {
        gradient: "from-emerald-600 to-emerald-700",
        trendUp: "text-emerald-200",
        trendDown: "text-emerald-300",
      },
    }[color];

    return (
      <motion.div
        whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.95 }}
      >
        <Card
          className={`bg-gradient-to-br ${config.gradient} text-white shadow-lg rounded-xl overflow-hidden border border-gray-700`}
        >
          <CardBody className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">{title}</p>
                <p className="text-3xl font-bold mt-1">{value}</p>
              </div>
              <motion.div
                className="p-4 bg-white bg-opacity-20 rounded-full"
                whileHover={{ rotate: 15 }}
              >
                <Icon className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    );
  };

  const DashboardCard = ({ title, children }) => (
    <Card className="bg-black border border-gray-800 rounded-xl shadow-lg overflow-hidden h-full">
      <CardHeader className="border-b border-gray-800 p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          {title}
        </h2>
        <span className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full backdrop-blur-sm">
          Recent 3
        </span>
      </CardHeader>
      <CardBody className="p-4">{children}</CardBody>
    </Card>
  );

  return (
    <div className="space-y-6 bg-black min-h-screen">
      <motion.h1
        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Your Dashboard
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Registered Events"
          value={userMetrics.registerd_events}
          icon={Calendar}
          trend={3.7}
          color="purple"
        />
        <SummaryCard
          title="Bookmarked Posts"
          value={userMetrics.bookmarked_posts}
          icon={Bookmark}
          trend={2.8}
          color="blue"
        />
        <SummaryCard
          title="Engagement Rate"
          value={userMetrics.engagement_rate + "%"}
          icon={Target}
          trend={1.4}
          color="green"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <DashboardCard title="Notifications">
            <NotificationsList userId={user.id} />
          </DashboardCard>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <DashboardCard title="Registered Events">
            <RegisteredEvents events={registeredEvents} />
          </DashboardCard>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <DashboardCard title="Joined Study Groups">
            <JoinedStudyGroups groups={joinedGroups} />
          </DashboardCard>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <DashboardCard title="Recent Activity">
            <RecentActivity userId={user.id} />
          </DashboardCard>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;

