import React from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="h-full flex flex-col justify-between p-4">
      {/* Placeholder for future menu items */}
      <div className="space-y-2">
        {user && (
          <div className="p-4 rounded-xl bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                {user.email?.[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.email?.split('@')[0]}</p>
                <p className="text-sm text-gray-500">@{user.email?.split('@')[0]}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;