import { createAppSlice } from "../../../app/createAppSlice";
import type {
  CreateProjectDto,
  ProjectsSliceState,
  InviteUserDto,
  ProjectSummary,
} from "../types";
import * as api from "../services/api";
import { AxiosError } from "axios";

const initialState: ProjectsSliceState = {
  projects: [],
  projectSummaries: [],
  members: [],
  isLoading: false,
};

export const projectsSlice = createAppSlice({
  name: "projects",
  initialState,
  reducers: (create) => ({
    // Get project summaries for dashboard
    getProjectSummaries: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        console.log("🔵 Fetching project summaries...");
        try {
          const data = await api.fetchProjectSummaries();
          console.log("🟢 Project summaries:", data);
          return data;
        } catch (error) {
          console.error("🔴 Error fetching summaries:", error);
          const apiError = error as AxiosError<{ message?: string }>;
          return rejectWithValue(
            apiError.response?.data?.message ||
              apiError.message ||
              "Failed to fetch project summaries",
          );
        }
      },
      {
        pending: (state) => {
          if (!state) return;
          state.isLoading = true;
        },
        fulfilled: (state, action) => {
          if (!state) return;
          try {
            const newSummaries = action.payload || [];
            state.projectSummaries = [...newSummaries];
            state.isLoading = false;
            console.log("✅ Summaries loaded:", state.projectSummaries.length);
          } catch (error) {
            console.error("Error in getProjectSummaries.fulfilled:", error);
            state.isLoading = false;
          }
        },
        rejected: (state, action) => {
          if (!state) return;
          state.isLoading = false;
          state.projectSummaries = [];
          console.error("❌ Failed to load summaries:", action.payload);
        },
      },
    ),

    // Get all projects (legacy)
    getAllProjects: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        console.log("🔵 Fetching projects from API...");
        try {
          const data = await api.fetchProjects();
          console.log("🟢 Projects from API:", data);
          return data;
        } catch (error) {
          console.error("🔴 Error fetching projects:", error);
          const apiError = error as AxiosError<{ message?: string }>;
          return rejectWithValue(
            apiError.response?.data?.message ||
              apiError.message ||
              "Failed to fetch projects",
          );
        }
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, action) => {
          state.isLoading = false;
          state.projects = action.payload;
          console.log("✅ Projects loaded:", state.projects.length);
        },
        rejected: (state, action) => {
          state.isLoading = false;
          state.projects = [];
          console.error("❌ Failed to load projects:", action.payload);
        },
      },
    ),

    // Get members of a specific project
    getProjectMembers: create.asyncThunk(
      async (projectId: string, { rejectWithValue }) => {
        console.log(`🔵 Fetching members for project ${projectId}...`);
        try {
          const data = await api.fetchProjectMembers(projectId);
          console.log(`🟢 Members for project ${projectId}:`, data);
          return data;
        } catch (error) {
          console.error(`🔴 Error fetching members:`, error);
          const apiError = error as AxiosError<{ message?: string }>;

          return rejectWithValue({
            status: apiError.response?.status,
            message:
              apiError.response?.data?.message ||
              apiError.message ||
              "Failed to fetch members",
          });
        }
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, action) => {
          state.isLoading = false;
          state.members = action.payload;
        },
        rejected: (state, action) => {
          state.isLoading = false;
          state.members = [];
          const payload = action.payload as { message?: string } | undefined;
          state.inviteErrorMessage =
            payload?.message || "Error loading members";
          console.error("❌ Failed to load members:", action.payload);
        },
      },
    ),

    // Create a new project
    createProject: create.asyncThunk(
      async (dto: CreateProjectDto, { rejectWithValue }) => {
        console.log("🔵 Creating project:", dto);
        try {
          const data = await api.fetchCreateProject(dto);
          console.log("🟢 Project created:", data);
          return data;
        } catch (error) {
          console.error("🔴 Error creating project:", error);
          const apiError = error as AxiosError<{ message?: string }>;
          return rejectWithValue(
            apiError.response?.data?.message ||
              apiError.message ||
              "Failed to create project",
          );
        }
      },
      {
        pending: (state) => {
          state.createProjectErrorMessage = "";
        },
        fulfilled: (state, action) => {
          state.projects.push(action.payload);
          // Also add to summaries
          if (action.payload) {
            const newSummary: ProjectSummary = {
              id: action.payload.id,
              title: action.payload.title,
              description: action.payload.description,
              activeTasksCount: 0,
              executorsCount: 1,
              status: "OPEN",
            };
            state.projectSummaries.push(newSummary);
          }
          state.createProjectErrorMessage = "";
        },
        rejected: (state, action) => {
          state.createProjectErrorMessage = action.payload as string;
        },
      },
    ),

    // Update project
    updateProject: create.asyncThunk(
      async (
        {
          id,
          title,
          description,
        }: { id: string; title: string; description: string },
        { rejectWithValue },
      ) => {
        console.log(`🔵 Updating project: ${id}`);
        try {
          const data = await api.fetchUpdateProject(id, { title, description });
          console.log("🟢 Project updated:", data);
          return data;
        } catch (error) {
          console.error("🔴 Error updating project:", error);
          const apiError = error as AxiosError<{ message?: string }>;
          return rejectWithValue(
            apiError.response?.data?.message ||
              apiError.message ||
              "Failed to update project",
          );
        }
      },
      {
        pending: (state) => {
          if (!state) return;
          state.updateProjectErrorMessage = "";
          state.updateProjectSuccessMessage = "";
          state.isLoading = true;
        },
        fulfilled: (state, action) => {
          if (!state) return;

          try {
            const updatedProject = action.payload;

            if (!updatedProject?.id) {
              console.error("Invalid project data", updatedProject);
              return;
            }

            // Create a deep copy for a safe update
            const newProjects = state.projects ? [...state.projects] : [];
            const projectIndex = newProjects.findIndex(
              (p) => p.id === updatedProject.id,
            );
            if (projectIndex !== -1) {
              newProjects[projectIndex] = {
                ...newProjects[projectIndex],
                ...updatedProject,
              };
            }

            const newSummaries = state.projectSummaries
              ? [...state.projectSummaries]
              : [];
            const summaryIndex = newSummaries.findIndex(
              (p) => p.id === updatedProject.id,
            );
            if (summaryIndex !== -1) {
              newSummaries[summaryIndex] = {
                ...newSummaries[summaryIndex],
                title: updatedProject.title,
                description: updatedProject.description,
              };
            }

            let newCurrentProject = state.currentProject;
            if (
              newCurrentProject &&
              newCurrentProject.id === updatedProject.id
            ) {
              newCurrentProject = {
                ...newCurrentProject,
                title: updatedProject.title,
                description: updatedProject.description,
              };
            }

            // Применяем все изменения сразу
            state.projects = newProjects;
            state.projectSummaries = newSummaries;
            state.currentProject = newCurrentProject;
            state.isLoading = false;
            state.updateProjectSuccessMessage = "Project updated successfully!";

            setTimeout(() => {
              if (state) state.updateProjectSuccessMessage = "";
            }, 3000);
          } catch (error) {
            console.error("Error in updateProject.fulfilled:", error);
            state.isLoading = false;
          }
        },
        rejected: (state, action) => {
          if (!state) return;
          state.isLoading = false;
          state.updateProjectErrorMessage = action.payload as string;

          setTimeout(() => {
            if (state) state.updateProjectErrorMessage = "";
          }, 3000);
        },
      },
    ),

    // Clear update messages
    clearUpdateMessages: create.reducer((state) => {
      state.updateProjectErrorMessage = "";
      state.updateProjectSuccessMessage = "";
    }),

    // delete Project
    deleteProject: create.asyncThunk(
      async (projectId: string, { rejectWithValue }) => {
        console.log(`🔵 Deleting project: ${projectId}`);
        try {
          await api.fetchDeleteProject(projectId);
          return projectId;
        } catch (error) {
          console.error("🔴 Error deleting project:", error);
          const apiError = error as AxiosError<{ message?: string }>;
          return rejectWithValue(
            apiError.response?.data?.message ||
              apiError.message ||
              "Failed to delete project",
          );
        }
      },
      {
        pending: (state) => {
          if (!state) return;
          state.isLoading = true;
        },
        fulfilled: (state, action) => {
          if (!state) return;
          state.isLoading = false;
          if (state.projects) {
            state.projects = state.projects.filter(
              (p) => p.id !== action.payload,
            );
          }
          if (state.projectSummaries) {
            state.projectSummaries = state.projectSummaries.filter(
              (p) => p.id !== action.payload,
            );
          }
          if (state.currentProject?.id === action.payload) {
            state.currentProject = undefined;
          }
          state.inviteSuccessMessage = "Project deleted successfully!";
          setTimeout(() => {
            if (state) state.inviteSuccessMessage = "";
          }, 3000);
        },
        rejected: (state, action) => {
          if (!state) return;
          state.isLoading = false;
          state.createProjectErrorMessage = action.payload as string;
          setTimeout(() => {
            if (state) state.createProjectErrorMessage = "";
          }, 3000);
        },
      },
    ),

    // Get project by ID
    getProjectById: create.asyncThunk(
      async (projectId: string, { rejectWithValue }) => {
        console.log(`🔵 Fetching project by ID: ${projectId}`);
        try {
          const data = await api.fetchProjectById(projectId);
          console.log("🟢 Project data:", data);
          return data;
        } catch (error) {
          console.error("🔴 Error fetching project:", error);
          const apiError = error as AxiosError<{ message?: string }>;
          return rejectWithValue(
            apiError.response?.data?.message ||
              apiError.message ||
              "Failed to fetch project",
          );
        }
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, action) => {
          state.isLoading = false;
          state.currentProject = action.payload;
        },
        rejected: (state, action) => {
          state.isLoading = false;
          state.currentProject = undefined;
          console.error("❌ Failed to load project:", action.payload);
        },
      },
    ),

    // Clear current project
    clearCurrentProject: create.reducer((state) => {
      state.currentProject = undefined;
    }),

    // Invite a user to the project
    inviteUser: create.asyncThunk(
      async (
        { projectId, dto }: { projectId: string; dto: InviteUserDto },
        { rejectWithValue },
      ) => {
        console.log(`🔵 Inviting user to project ${projectId}:`, dto);
        try {
          const data = await api.fetchInviteUser(projectId, dto);
          console.log("🟢 Invitation sent:", data);
          return data;
        } catch (error) {
          console.error("🔴 Error inviting user:", error);
          const apiError = error as AxiosError<{ message?: string }>;
          return rejectWithValue(
            apiError.response?.data?.message ||
              apiError.message ||
              "Error sending invitation",
          );
        }
      },
      {
        pending: (state) => {
          state.inviteErrorMessage = "";
          state.inviteSuccessMessage = "";
        },
        fulfilled: (state, action) => {
          state.members.push(action.payload);
          state.inviteSuccessMessage = "Invitation sent successfully!";
        },
        rejected: (state, action) => {
          state.inviteErrorMessage = action.payload as string;
        },
      },
    ),

    // Accept invitation
    acceptInvite: create.asyncThunk(
      async (inviteToken: string, { rejectWithValue }) => {
        console.log("🔵 Accepting invitation with token:", inviteToken);
        try {
          const data = await api.fetchAcceptInvite(inviteToken);
          console.log("🟢 Invitation accepted:", data);
          return data;
        } catch (error) {
          console.error("🔴 Error accepting invitation:", error);
          const apiError = error as AxiosError<{ message?: string }>;
          return rejectWithValue(
            apiError.response?.data?.message ||
              apiError.message ||
              "Error accepting invitation",
          );
        }
      },
      {
        fulfilled: (state, action) => {
          const memberIndex = state.members.findIndex(
            (m) => m.id === action.payload.id,
          );
          if (memberIndex !== -1) {
            state.members[memberIndex] = action.payload;
          }
          state.acceptInviteMessage =
            "You have successfully joined the project!";
        },
        rejected: (state, action) => {
          state.acceptInviteMessage =
            (action.payload as string) || "Invitation expired or invalid";
        },
      },
    ),

    // Resend invitation
    resendInvite: create.asyncThunk(
      async (invitationId: number, { rejectWithValue }) => {
        console.log("🔵 Resending invitation:", invitationId);
        try {
          const data = await api.fetchResendInvite(invitationId);
          console.log("🟢 Invitation resent:", data);
          return data;
        } catch (error) {
          console.error("🔴 Error resending invitation:", error);
          const apiError = error as AxiosError<{ message?: string }>;
          return rejectWithValue(
            apiError.response?.data?.message ||
              apiError.message ||
              "Error resending invitation",
          );
        }
      },
      {
        fulfilled: (state, action) => {
          const memberIndex = state.members.findIndex(
            (m) => m.id === action.payload.id,
          );
          if (memberIndex !== -1) {
            state.members[memberIndex] = action.payload;
          }
          state.inviteSuccessMessage = "Invitation resent successfully!";
        },
        rejected: (state, action) => {
          state.inviteErrorMessage = action.payload as string;
        },
      },
    ),

    // Revoke invitation
    revokeInvite: create.asyncThunk(
      async (invitationId: number, { rejectWithValue }) => {
        console.log("🔵 Revoking invitation:", invitationId);
        try {
          const data = await api.fetchRevokeInvite(invitationId);
          console.log("🟢 Invitation revoked:", data);
          return data;
        } catch (error) {
          console.error("🔴 Error revoking invitation:", error);
          const apiError = error as AxiosError<{ message?: string }>;
          return rejectWithValue(
            apiError.response?.data?.message ||
              apiError.message ||
              "Error revoking invitation",
          );
        }
      },
      {
        fulfilled: (state, action) => {
          state.members = state.members.filter((m) => m.id !== action.payload);
          state.inviteSuccessMessage = "Invitation revoked successfully!";
        },
        rejected: (state, action) => {
          state.inviteErrorMessage = action.payload as string;
        },
      },
    ),

    // Clear invitation messages
    clearInviteMessages: create.reducer((state) => {
      state.inviteErrorMessage = "";
      state.inviteSuccessMessage = "";
      state.acceptInviteMessage = "";
    }),

    // Set current project
    setCurrentProject: create.reducer<ProjectSummary | undefined>(
      (state, action) => {
        state.currentProject = action.payload;
      },
    ),
  }),
  selectors: {
    selectProjects: (state) => state.projects,
    selectProjectSummaries: (state) => state.projectSummaries,
    selectProjectMembers: (state) => state.members,
    selectCurrentProject: (state) => state.currentProject,
    selectIsLoading: (state) => state.isLoading,
    selectCreateProjectErrorMessage: (state) => state.createProjectErrorMessage,
    selectUpdateProjectErrorMessage: (state) => state.updateProjectErrorMessage,
    selectUpdateProjectSuccessMessage: (state) =>
      state.updateProjectSuccessMessage,
    selectInviteErrorMessage: (state) => state.inviteErrorMessage,
    selectInviteSuccessMessage: (state) => state.inviteSuccessMessage,
    selectAcceptInviteMessage: (state) => state.acceptInviteMessage,
  },
});

export const {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  clearCurrentProject,
  getProjectSummaries,
  getProjectMembers,
  inviteUser,
  acceptInvite,
  resendInvite,
  revokeInvite,
  clearInviteMessages,
  clearUpdateMessages,
  setCurrentProject,
} = projectsSlice.actions;

export const {
  selectProjects,
  selectProjectSummaries,
  selectProjectMembers,
  selectCurrentProject,
  selectIsLoading,
  selectCreateProjectErrorMessage,
  selectUpdateProjectErrorMessage,
  selectUpdateProjectSuccessMessage,
  selectInviteErrorMessage,
  selectInviteSuccessMessage,
  selectAcceptInviteMessage,
} = projectsSlice.selectors;
