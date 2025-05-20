import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
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
import TrendingSidebar from './components/TrendingSidebar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4">
            <div className="flex gap-6 relative">
              {/* Left Sidebar - Visible on medium and large screens */}
              <div className="hidden md:block w-64 fixed left-4 top-16 bottom-0">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-full overflow-y-auto">
                  <div className="md:hidden lg:block">
                    <Sidebar />
                  </div>
                  <div className="hidden md:block lg:hidden p-4 space-y-4">
                    {/* Placeholder blocks for medium screens */}
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <main className="w-full md:ml-72 lg:ml-72 lg:mr-88 pt-16 pb-16 md:pb-6 md:max-w-[600px] mx-auto">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/create" element={<CreatePostPage />} />
                  <Route path="/groups" element={<GroupsPage />} />
                  <Route path="/post/:id" element={<PostPage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                </Routes>
              </main>

              {/* Right Sidebar - Only visible on large screens */}
              <div className="hidden lg:block w-80 fixed right-4 top-16 bottom-0">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-full overflow-y-auto">
                  <TrendingSidebar />
                </div>
              </div>
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
      </AuthProvider>
    </Router>
  );
}

export default App;