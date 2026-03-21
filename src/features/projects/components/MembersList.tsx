import React from "react";
import type { ProjectMember } from "../types";

interface MembersListProps {
  members: ProjectMember[];
  isOwner: boolean;
  currentUserEmail?: string;
  onResend: (invitationId: number) => void;
  onRevoke: (invitationId: number) => void;
}

const MembersList: React.FC<MembersListProps> = ({
  members,
  isOwner,
  currentUserEmail,
  onResend,
  onRevoke,
}) => {
  const getTimeRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null;

    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "OWNER":
        return "bg-purple-100 text-purple-800";
      case "ADMIN":
        return "bg-blue-100 text-blue-800";
      case "MEMBER":
        return "bg-green-100 text-green-800";
      case "VIEWER":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
            Active
          </span>
        );
      case "PENDING":
        return (
          <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
            Pending
          </span>
        );
      case "EXPIRED":
        return (
          <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  if (members.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">No members yet</p>
    );
  }

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-medium text-sm truncate">
                {member.email}
              </span>
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${getRoleBadgeColor(member.role)}`}
              >
                {member.role}
              </span>
              {getStatusBadge(member.status)}
            </div>

            {member.expiresAt && member.status === "PENDING" && (
              <p className="text-xs text-gray-500">
                Expires in: {getTimeRemaining(member.expiresAt)}
              </p>
            )}
          </div>

          {(isOwner || currentUserEmail === member.email) &&
            member.status === "PENDING" && (
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => onResend(member.id)}
                  className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                >
                  Resend
                </button>
                {isOwner && (
                  <button
                    onClick={() => onRevoke(member.id)}
                    className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                  >
                    Revoke
                  </button>
                )}
              </div>
            )}
        </div>
      ))}
    </div>
  );
};

export default MembersList;
