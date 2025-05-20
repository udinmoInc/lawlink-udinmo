import React, { useState, useEffect } from 'react';
import { supabase, type GroupInvite } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Check, X, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const GroupInvites: React.FC = () => {
  const { user } = useAuth();
  const [invites, setInvites] = useState<GroupInvite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInvites();
    }
  }, [user]);

  const fetchInvites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('group_invites')
        .select(`
          id,
          status,
          created_at,
          group_id,
          inviter_id,
          invitee_id,
          group:group_id (
            id,
            title,
            description,
            cover_image_url,
            is_private,
            created_at,
            updated_at
          ),
          inviter:inviter_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('invitee_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;
      setInvites(data);
    } catch (error: any) {
      console.error('Error fetching invites:', error);
      toast.error('Failed to load invites');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteResponse = async (inviteId: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from('group_invites')
        .update({ status: accept ? 'accepted' : 'declined' })
        .eq('id', inviteId);

      if (error) throw error;

      setInvites(invites.filter(invite => invite.id !== inviteId));
      toast.success(accept ? 'Joined group successfully!' : 'Invite declined');
    } catch (error: any) {
      console.error('Error handling invite:', error);
      toast.error('Failed to process invite');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (invites.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Group Invites</h2>
      <div className="space-y-4">
        {invites.map((invite) => (
          <div
            key={invite.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{invite.group?.title}</h3>
                <p className="text-sm text-gray-500">
                  Invited by {invite.inviter?.full_name || invite.inviter?.username}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleInviteResponse(invite.id, true)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={() => handleInviteResponse(invite.id, false)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};