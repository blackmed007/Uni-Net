import React, { useState, useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";
import UserNavbar from "../../components/user/UserNavbar";
import UserDashboard from "../../components/user/dashboard/UserDashboard";
import NotificationsList from "../../components/user/dashboard/NotificationsList";
import JoinedStudyGroups from "../../components/user/dashboard/JoinedStudyGroups";
import RegisteredEvents from "../../components/user/dashboard/RegisteredEvents";
import RecentActivity from "../../components/user/dashboard/RecentActivity";
import useDarkMode from "../../hooks/useDarkMode";
import UsersAPI from "../../services/users.api";

const UserDashboardPage = () => {
  const [user, setUser] = useState(null);
  const [studyGroups, setStudyGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [userActivities, setUserActivities] = useState([]);
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from /users/me endpoint
        const userData = await UsersAPI.getCurrentUser();

        // Update localStorage with fetched user data
        localStorage.setItem("userData", JSON.stringify(userData));

        // Update localStorage with fetched user data
        // localStorage.setItem("userMetric", JSON.stringify(userMetrics));

        // Set user state
        setUser(userData);

        // Set events from the user data
        if (userData && userData.events) {
          setEvents(userData.events);
          localStorage.setItem("events", JSON.stringify(userData.events));
        }

        // Retrieve other data from localStorage
        const storedGroups = JSON.parse(
          localStorage.getItem("studyGroups") || "[]",
        );
        const storedPosts = JSON.parse(
          localStorage.getItem("blogPosts") || "[]",
        );
        const storedBookmarks = JSON.parse(
          localStorage.getItem("bookmarkedPosts") || "[]",
        );

        setStudyGroups(storedGroups);
        setBlogPosts(storedPosts);
        setBookmarkedPosts(storedBookmarks);

        // Fetch user activities if user exists
        if (userData && userData.id) {
          const activities = await UsersAPI.getUserActivity(userData.id);
          setUserActivities(activities);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "bookmarkedPosts") {
        setBookmarkedPosts(JSON.parse(e.newValue || "[]"));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (!user) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <NextUIProvider>
      <div className="flex h-screen bg-black text-white">
        <div className="flex flex-col flex-1 overflow-hidden">
          <UserNavbar
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            user={user}
          />
          <div className="flex-1 overflow-auto p-6 bg-black mt-16">
            <UserDashboard
              user={user}
              studyGroups={studyGroups}
              events={events}
              blogPosts={blogPosts}
              bookmarkedPosts={bookmarkedPosts}
              NotificationsList={NotificationsList}
              JoinedStudyGroups={JoinedStudyGroups}
              RegisteredEvents={RegisteredEvents}
              RecentActivity={RecentActivity}
            />
          </div>
        </div>
      </div>
    </NextUIProvider>
  );
};

export default UserDashboardPage;

