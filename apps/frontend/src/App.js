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
import Error from './pages/Error';
import UnderMaintenance from './pages/UnderMaintenance';
import UserSidebar from './components/user/UserSidebar';
import UserNavbar from './components/user/UserNavbar';
import useDarkMode from './hooks/useDarkMode';

// Protected Route for authenticated users
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('access_token');
  const userDataString = localStorage.getItem('userData');
  
  if (!token || !userDataString) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Route for admin-only access
const AdminRoute = ({ children }) => {
  const token = sessionStorage.getItem('access_token');
  const userDataString = localStorage.getItem('userData');
  
  if (!token || !userDataString) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    const userData = JSON.parse(userDataString);
    if (!userData || userData.role?.toString().toLowerCase() !== 'admin') {
      return <Navigate to="/403" replace />;
    }
    return children;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return <Navigate to="/login" replace />;
  }
};

// User Route for user-only access
const UserRoute = ({ children }) => {
  const token = sessionStorage.getItem('access_token');
  const userDataString = localStorage.getItem('userData');
  
  if (!token || !userDataString) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    const userData = JSON.parse(userDataString);
    if (!userData || userData.role?.toString().toLowerCase() !== 'user') {
      return <Navigate to="/403" replace />;
    }
    return children;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return <Navigate to="/login" replace />;
  }
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

  // For maintenance mode - you can make this dynamic based on your needs
  const isMaintenanceMode = false;

  if (isMaintenanceMode) {
    return <UnderMaintenance />;
  }

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

            {/* Error and Maintenance routes */}
            <Route path="/maintenance" element={<UnderMaintenance />} />
            <Route path="/error" element={<Error status={500} />} />
            <Route path="/403" element={<Error status={403} />} />
            <Route path="/404" element={<Error status={404} />} />

            {/* Protected onboarding route */}
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            } />

            {/* Protected admin routes */}
            <Route path="/admin/*" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />

            {/* Protected user routes */}
            <Route path="/user" element={<Navigate to="/user/dashboard" replace />} />
            <Route path="/user/*" element={
              <UserRoute>
                <UserLayout>
                  <Routes>
                    <Route path="dashboard" element={<UserDashboardPage />} />
                    <Route path="events" element={<UserEventsPage />} />
                    <Route path="study-groups" element={<UserStudyGroupsPage />} />
                    <Route path="blog" element={<UserBlogPage />} />
                    <Route path="settings" element={<UserSettingsPage />} />
                    {/* Catch undefined user routes */}
                    <Route path="*" element={<Error status={404} />} />
                  </Routes>
                </UserLayout>
              </UserRoute>
            } />

            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<Error status={404} />} />
          </Routes>
        </div>
      </Router>
    </NextUIProvider>
  );
}

export default App;