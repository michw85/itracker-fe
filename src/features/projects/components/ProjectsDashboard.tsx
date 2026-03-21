import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  getProjectSummaries,
  getProjectMembers,
  setCurrentProject,
  resendInvite,
  revokeInvite,
  clearInviteMessages,
  selectProjectSummaries,
  selectCurrentProject,
  selectProjectMembers,
  selectIsLoading,
  selectInviteSuccessMessage,
  selectInviteErrorMessage,
} from "../slice/projectsSlice";
import ProjectSummaryCard from "./ProjectSummaryCard";
import InviteUserForm from "./InviteUserForm";
import MembersList from "./MembersList";
import ProjectForm from "./ProjectForm";
import { selectUser } from "../../../features/auth/slice/authSlice";
import * as api from "../services/api";
import type { ProjectSummary } from "../types";

const ProjectsDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const summaries = useAppSelector(selectProjectSummaries);
  const isLoading = useAppSelector(selectIsLoading);
  const currentProject = useAppSelector(selectCurrentProject);
  const members = useAppSelector(selectProjectMembers);
  const successMessage = useAppSelector(selectInviteSuccessMessage);
  const errorMessage = useAppSelector(selectInviteErrorMessage);

  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);

  // Load project summaries on mount
  useEffect(() => {
    dispatch(getProjectSummaries());
  }, [dispatch]);

  // Clear messages when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearInviteMessages());
    };
  }, [dispatch]);

  // Load user role and members when project is selected
  useEffect(() => {
    if (!currentProject?.id || !user) return;

    const loadProjectData = async () => {
      setRoleLoading(true);
      try {
        console.log(`🔵 Loading role for project: ${currentProject.id}`);

        // Get role from backend
        const roleData = await api.checkUserRole(currentProject.id);
        console.log("🟢 User role from API:", roleData);
        setUserRole(roleData.role);

        // Get members from backend
        await dispatch(getProjectMembers(currentProject.id)).unwrap();
      } catch (error) {
        console.error("Error loading project data:", error);
        setUserRole(null);
      } finally {
        setRoleLoading(false);
      }
    };

    loadProjectData();
  }, [currentProject, user, dispatch]);

  const canInvite = userRole === "OWNER" || userRole === "ADMIN";

  const handleProjectSelect = (project: ProjectSummary) => {
    dispatch(setCurrentProject(project));
    setShowNewProjectForm(false);
  };

  if (isLoading && summaries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading projects...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={() => setShowNewProjectForm(!showNewProjectForm)}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          New project
        </button>
      </div>

      {/* New Project Form */}
      {showNewProjectForm && (
        <div className="mb-6">
          <ProjectForm
            onSuccess={() => {
              setShowNewProjectForm(false);
              dispatch(getProjectSummaries()); // Refresh projects list
            }}
          />
        </div>
      )}

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Project Cards */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summaries.map((project) => (
              <ProjectSummaryCard
                key={project.id}
                project={project}
                onClick={() => handleProjectSelect(project)}
                isSelected={currentProject?.id === project.id}
              />
            ))}
          </div>

          {summaries.length === 0 && !isLoading && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No projects yet. Create your first project!
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Project Details */}
        <div className="lg:col-span-1">
          {currentProject ? (
            <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-4">
              {/* Project Info */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {currentProject.title}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {currentProject.description}
                </p>
                <div className="flex items-center space-x-4 mb-4">
                  <div>
                    <span className="text-xs text-gray-500">Active tasks</span>
                    <p className="text-lg font-semibold text-gray-900">
                      {currentProject.activeTasksCount || 0}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Executors</span>
                    <p className="text-lg font-semibold text-gray-900">
                      {currentProject.executorsCount || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Debug Info - can be removed after setup */}
              <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                <p>User role: {userRole || "Not loaded"}</p>
                <p>Can invite: {canInvite ? "Yes" : "No"}</p>
                <p>Members count: {members.length}</p>
              </div>

              {/* Role Loading */}
              {roleLoading && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                  <span className="ml-2 text-sm">Loading project data...</span>
                </div>
              )}

              {/* Invite Form - Only for OWNER/ADMIN */}
              {!roleLoading && canInvite && (
                <div className="mb-6">
                  <InviteUserForm projectId={currentProject.id} />
                </div>
              )}

              {/* Members List */}
              {!roleLoading && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Team Members
                  </h3>
                  <MembersList
                    members={members}
                    isOwner={userRole === "OWNER"}
                    currentUserEmail={user?.email}
                    onResend={(invitationId) =>
                      dispatch(resendInvite(invitationId))
                    }
                    onRevoke={(invitationId) =>
                      dispatch(revokeInvite(invitationId))
                    }
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center text-gray-500">
              Select a project to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsDashboard;
