import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TrendingSidebar from './components/TrendingSidebar';
import MobileNavbar from './components/MobileNavbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import GroupsPage from './pages/GroupsPage';
import PostPage from './pages/PostPage';
import ExplorePage from './pages/ExplorePage';
import NotificationsPage from './pages/NotificationsPage';

const AppContent = () => {
  const { user } = useAuth();
  const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        {/* Desktop Left Sidebar */}
        <div className="hidden md:block w-[275px] fixed left-0 top-16 bottom-0 bg-white border-r border-gray-100 overflow-y-auto">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className={`flex-1 ${user ? 'md:ml-[275px] md:mr-[320px]' : ''} min-h-screen pb-16 md:pb-0`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/create" element={<CreatePostPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Routes>
        </div>

        {/* Desktop Right Sidebar */}
        <div className="hidden md:block w-[320px] fixed right-0 top-16 bottom-0 bg-white border-l border-gray-100 overflow-y-auto">
          <TrendingSidebar />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavbar />

      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#334155',
            border: '1px solid #e2e8f0'
          }
        }}
      />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;