import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { NextUIProvider } from "@nextui-org/react";
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminDashboard from './pages/admin/AdminDashboard';
import NewUserOnboardingPage from './pages/user/NewUserOnboardingPage';
import UserDashboardPage from './pages/user/UserDashboardPage';
import UserEventsPage from './pages/user/UserEventsPage';
import UserStudyGroupsPage from './pages/user/UserStudyGroupsPage';
import UserBlogPage from './pages/user/UserBlogPage';
import UserSettingsPage from './pages/user/UserSettingsPage';
import UserSidebar from './components/user/UserSidebar';
import UserNavbar from './components/user/UserNavbar';
import useDarkMode from './hooks/useDarkMode';
import { initializeMockData } from './utils/mockDataGenerator';

const ProtectedRoute = ({ children, requireAdmin = false, requireProfileCompleted = true }) => {
  const userDataString = localStorage.getItem('userData');
  const user = userDataString ? JSON.parse(userDataString) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'Admin') {
    return <Navigate to="/user/dashboard" replace />;
  }

  if (!requireAdmin && requireProfileCompleted && !user.profileCompleted) {
    return <Navigate to="/user/onboarding" replace />;
  }

  return children;
};

const UserLayout = ({ children }) => {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const userDataString = localStorage.getItem('userData');
  const user = userDataString ? JSON.parse(userDataString) : null;

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      <UserSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <UserNavbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} user={user} />
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  useEffect(() => {
    if (!localStorage.getItem('users')) {
      initializeMockData();
    }
  }, []);

  return (
    <NextUIProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />

            {/* Admin routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* User routes */}
            <Route path="/user/onboarding" element={
              <ProtectedRoute requireProfileCompleted={false}>
                <NewUserOnboardingPage />
              </ProtectedRoute>
            } />
            <Route path="/user/*" element={
              <ProtectedRoute>
                <UserLayout>
                  <Routes>
                    <Route path="dashboard" element={<UserDashboardPage />} />
                    <Route path="events" element={<UserEventsPage />} />
                    <Route path="study-groups" element={<UserStudyGroupsPage />} />
                    <Route path="blog" element={<UserBlogPage />} />
                    <Route path="settings" element={<UserSettingsPage />} />
                  </Routes>
                </UserLayout>
              </ProtectedRoute>
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