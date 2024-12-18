import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { NextUIProvider } from "@nextui-org/react";
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboardPage from './pages/user/UserDashboardPage';
import UserEventsPage from './pages/user/UserEventsPage';
import UserStudyGroupsPage from './pages/user/UserStudyGroupsPage';
import UserBlogPage from './pages/user/UserBlogPage';
import UserSettingsPage from './pages/user/UserSettingsPage';
import OnboardingPage from './pages/user/OnboardingPage';
import UserSidebar from './components/user/UserSidebar';
import UserNavbar from './components/user/UserNavbar';
import useDarkMode from './hooks/useDarkMode';
import { initializeMockData } from './utils/mockDataGenerator';

// TODO: Re-implement route protection and onboarding flow
// This is temporarily disabled for development purposes
const ProtectedRoute = ({ children }) => {
  return children;
};

const UserLayout = ({ children }) => {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const userDataString = localStorage.getItem('userData');
  const user = userDataString ? JSON.parse(userDataString) : null;

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''} bg-black`}>
      <UserSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <UserNavbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} user={user} />
        <div className="flex-1 overflow-auto bg-black text-gray-100 transition-colors duration-300 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isDarkMode] = useDarkMode();
  
  useEffect(() => {
    if (!localStorage.getItem('users')) {
      initializeMockData();
    }
  }, []);

  return (
    <NextUIProvider>
      <Router>
        <div className={`App bg-black min-h-screen ${isDarkMode ? 'dark' : ''}`}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />

            {/* TODO: Re-implement onboarding protection */}
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* TODO: Re-implement admin route protection */}
            <Route path="/admin/*" element={<AdminDashboard />} />

            {/* User routes - Layout wrapper removed for development */}
            <Route path="/user" element={<Navigate to="/user/dashboard" replace />} />
            <Route path="/user/*" element={
              <UserLayout>
                <Routes>
                  <Route path="dashboard" element={<UserDashboardPage />} />
                  <Route path="events" element={<UserEventsPage />} />
                  <Route path="study-groups" element={<UserStudyGroupsPage />} />
                  <Route path="blog" element={<UserBlogPage />} />
                  <Route path="settings" element={<UserSettingsPage />} />
                  <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
                </Routes>
              </UserLayout>
            } />

            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </NextUIProvider>
  );
}

export default App;