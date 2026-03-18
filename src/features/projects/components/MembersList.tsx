import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  getProjectMembers,
  resendInvite,
  revokeInvite,
  selectProjectMembers,
  selectIsLoading,
} from "../slice/projectsSlice";
import type { ProjectMember } from "../types";
import { selectUser } from "../../auth/slice/authSlice";

interface MembersListProps {
  projectId: string;
  isOwner: boolean; // Whether current user is project owner
}

const MembersList = ({ projectId, isOwner }: MembersListProps) => {
  const dispatch = useAppDispatch();
  const members = useAppSelector(selectProjectMembers);
  const isLoading = useAppSelector(selectIsLoading);
  const currentUser = useAppSelector(selectUser);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load members when component mounts
  useEffect(() => {
    dispatch(getProjectMembers(projectId));
  }, [dispatch, projectId]);

  // Calculate time remaining until token expiration
  const getTimeRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null;
    
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;
    
    if (diff <= 0) return "Expired / Истекло";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m / ${hours}ч ${minutes}м`;
  };

  // Handle resend invitation
  const handleResend = async (member: ProjectMember) => {
    try {
      await dispatch(resendInvite(member.id)).unwrap();
      setActionMessage({ type: 'success', text: 'Invitation resent successfully' });
      setTimeout(() => setActionMessage(null), 3000);
    } catch (error) {
      setActionMessage({ type: 'error', text: 'Error resending invitation ' });
    }
  };

  // Handle revoke invitation
  const handleRevoke = async (memberId: number) => {
    if (window.confirm('Are you sure you want to revoke this invitation?')) {
      try {
        await dispatch(revokeInvite(memberId)).unwrap();
        setActionMessage({ type: 'success', text: 'Invitation revoked' });
        setTimeout(() => setActionMessage(null), 3000);
      } catch (error) {
        setActionMessage({ type: 'error', text: 'Error revoking invitation' });
      }
    }
  };

  // Get color for role badge
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'OWNER': return 'bg-purple-100 text-purple-800';
      case 'ADMIN': return 'bg-blue-100 text-blue-800';
      case 'MEMBER': return 'bg-green-100 text-green-800';
      case 'VIEWER': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span>;
      case 'PENDING':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'EXPIRED':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Expired</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="text-center py-4 text-gray-500">Loading members... </div>;
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Project Members</h3>
      
      {actionMessage && (
        <div className={`mb-4 rounded-md p-3 text-sm border ${
          actionMessage.type === 'success' 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {actionMessage.text}
        </div>
      )}

      {members.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No members yet</p>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{member.email}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadgeColor(member.role)}`}>
                    {member.role === 'OWNER' ? 'Owner / Владелец' : 
                     member.role === 'ADMIN' ? 'Admin / Админ' : 
                     member.role === 'MEMBER' ? 'Member / Участник' : 'Viewer / Наблюдатель'}
                  </span>
                  {getStatusBadge(member.status)}
                </div>
                
                <div className="text-xs text-gray-500">
                  Invited: {new Date(member.invitedAt).toLocaleDateString()}
                  {member.expiresAt && member.status === 'PENDING' && (
                    <span className="ml-2">
                      ⏱ Expires in: {getTimeRemaining(member.expiresAt)}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions for owner and admins */}
              {(isOwner || currentUser?.email === member.email) && member.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResend(member)}
                    className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                  >
                    Resend
                  </button>
                  {isOwner && (
                    <button
                      onClick={() => handleRevoke(member.id)}
                      className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MembersList;