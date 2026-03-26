import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  getProjectSummaries,
  getProjectMembers,
  setCurrentProject,
  resendInvite,
  revokeInvite,
  clearInviteMessages,
  deleteProject,
  selectProjectSummaries,
  selectCurrentProject,
  selectProjectMembers,
  selectIsLoading,
  selectInviteSuccessMessage,
  selectInviteErrorMessage,
} from "../slice/projectsSlice";
import ProjectCard from "./ProjectCard";
import InviteUserForm from "./InviteUserForm";
import MembersList from "./MembersList";
import ProjectForm from "./ProjectForm";
import EditProjectForm from "./EditProjectForm";
import { selectUser } from "../../../features/auth/slice/authSlice";
import * as api from "../services/api";
import type { ProjectSummary } from "../types";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
} from "../../../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";

interface ProjectWithRole {
  project: ProjectSummary;
  role: string | null;
}

const ProjectsDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const summaries = useAppSelector(selectProjectSummaries);
  const isLoading = useAppSelector(selectIsLoading);
  const currentProject = useAppSelector(selectCurrentProject);
  const members = useAppSelector(selectProjectMembers);
  const successMessage = useAppSelector(selectInviteSuccessMessage);
  const errorMessage = useAppSelector(selectInviteErrorMessage);

  const [projectsWithRoles, setProjectsWithRoles] = useState<ProjectWithRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("my-projects");
  const [editingProject, setEditingProject] = useState<ProjectSummary | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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

  // Load roles for all projects when summaries or user changes
  useEffect(() => {
    const loadRoles = async () => {
      if (!summaries.length || !user) {
        setLoadingRoles(false);
        return;
      }

      setLoadingRoles(true);
      try {
        const roles = await Promise.all(
          summaries.map(async (project) => {
            try {
              const roleData = await api.checkUserRole(project.id);
              console.log(`✅ Project: "${project.title}" (${project.id}) - Role: ${roleData.role}`);
              return { project, role: roleData.role };
            } catch (error) {
              console.error(`❌ Error loading role for project ${project.id}:`, error);
              return { project, role: null };
            }
          }),
        );
        setProjectsWithRoles(roles);
        console.log("Roles summary:", roles.map(r => ({ title: r.project.title, role: r.role })));
      } catch (error) {
        console.error("Error loading roles:", error);
      } finally {
        setLoadingRoles(false);
      }
    };

    loadRoles();
  }, [summaries, user]);

  // Load user role and members when project is selected
  useEffect(() => {
    if (!currentProject?.id || !user) return;

    const loadProjectData = async () => {
      setRoleLoading(true);
      try {
        const roleData = await api.checkUserRole(currentProject.id);
        setUserRole(roleData.role);
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

  // We share projects
  const myProjects = projectsWithRoles.filter(
    ({ role }) => role === "OWNER" || role === "ADMIN",
  );

  const invitedProjects = projectsWithRoles.filter(
    ({ role }) => role === "MEMBER" || role === "VIEWER",
  );

  const handleProjectSelect = (project: ProjectSummary) => {
    dispatch(setCurrentProject(project));
    setShowNewProjectForm(false);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await dispatch(deleteProject(projectId)).unwrap();
      await dispatch(getProjectSummaries());
      if (currentProject?.id === projectId) {
        dispatch(setCurrentProject(undefined));
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleEditProject = async (project: ProjectSummary) => {
    try {
      const roleData = await api.checkUserRole(project.id);
      console.log("User role for edit:", roleData.role);

      if (roleData.role !== "OWNER" && roleData.role !== "ADMIN") {
        alert("You don't have permission to edit this project");
        return;
      }

      setEditingProject(project);
      setEditDialogOpen(true);
    } catch (error) {
      console.error("Error checking permissions:", error);
      alert("Could not verify permissions");
    }
  };

  const handleManageMembers = (project: ProjectSummary) => {
    dispatch(setCurrentProject(project));
    setActiveTab("members");
  };

  const handleProjectCreated = async () => {
    setShowNewProjectForm(false);
    
    // Loading an updated list of projects
    await dispatch(getProjectSummaries());
    
    // We wait a bit for the summaries to update, then force a reload of the roles.
    setTimeout(() => {
      setLoadingRoles(true);
    }, 100);
  };

  // Debug pins
  console.log("📊 summaries count:", summaries.length);
  console.log("📊 projectsWithRoles count:", projectsWithRoles.length);
  console.log("📊 loadingRoles:", loadingRoles);
  console.log("📊 myProjects count:", myProjects.length);
  console.log("📊 invitedProjects count:", invitedProjects.length);

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
      {/* Header with New Project Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Button onClick={() => setShowNewProjectForm(true)}>
          New project
        </Button>
      </div>

      {/* New Project Dialog */}
      <Dialog open={showNewProjectForm} onOpenChange={setShowNewProjectForm}>
        <DialogContent className="sm:max-w-md">
          <ProjectForm 
            onSuccess={handleProjectCreated}
            onCancel={() => setShowNewProjectForm(false)}
          />
        </DialogContent>
      </Dialog>

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
          {loadingRoles ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              <span className="ml-2 text-gray-500">
                Loading project roles...
              </span>
            </div>
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="my-projects">
                  My Projects ({myProjects.length})
                </TabsTrigger>
                <TabsTrigger value="invited-projects">
                  Invited ({invitedProjects.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="my-projects">
                {myProjects.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                      No projects yet. Create your first project!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myProjects.map(({ project, role }) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        userRole={role}
                        onDelete={handleDeleteProject}
                        onEdit={handleEditProject}
                        onManageMembers={handleManageMembers}
                        onClick={() => handleProjectSelect(project)}
                        isSelected={currentProject?.id === project.id}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="invited-projects">
                {invitedProjects.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No invited projects yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {invitedProjects.map(({ project, role }) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        userRole={role}
                        onDelete={handleDeleteProject}
                        onEdit={handleEditProject}
                        onManageMembers={handleManageMembers}
                        onClick={() => handleProjectSelect(project)}
                        isSelected={currentProject?.id === project.id}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
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

      {/* Edit Project Dialog */}
      {editingProject && (
        <EditProjectForm
          project={editingProject}
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) {
              setTimeout(() => setEditingProject(null), 300);
            }
          }}
          onSuccess={() => {
            dispatch(getProjectSummaries());
          }}
        />
      )}
    </div>
  );
};

export default ProjectsDashboard;