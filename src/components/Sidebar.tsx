import React, { useEffect, useState } from 'react';
import { supabase, type Group, type Profile } from '../lib/supabase';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [seniorMembers, setSeniorMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch top 5 groups
      const { data: groupsData } = await supabase
        .from('groups')
        .select('*')
        .limit(5)
        .order('created_at', { ascending: false });

      if (groupsData) {
        setGroups(groupsData);
      }

      // Fetch 10 senior members (older accounts)
      const { data: membersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(10);

      if (membersData) {
        setSeniorMembers(membersData);
      }
    } catch (error) {
      console.error('Error fetching sidebar data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Groups</h2>
        <div className="space-y-3">
          {groups.map((group) => (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {group.cover_image_url ? (
                <img
                  src={group.cover_image_url}
                  alt={group.title}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                  <Users className="text-white" size={20} />
                </div>
              )}
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">{group.title}</h3>
                {group.description && (
                  <p className="text-sm text-gray-500 truncate">{group.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Senior Members</h2>
        <div className="space-y-3">
          {seniorMembers.map((member) => (
            <Link
              key={member.id}
              to={`/profile/${member.id}`}
              className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={member.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  {member.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">{member.full_name || member.username}</h3>
                <p className="text-xs text-gray-500">Member since {new Date(member.created_at).getFullYear()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;