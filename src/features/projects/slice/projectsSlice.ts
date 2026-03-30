import { createAppSlice } from "../../../app/createAppSlice";
import type {
  CreateProjectDto,
  ProjectsSliceState,
  InviteUserDto,
  ProjectSummary,
} from "../types";
import * as api from "../services/api";
import { AxiosError } from "axios";
import { logger } from "../../../lib/logger";

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
        try {
          const data = await api.fetchProjectSummaries();
          return data;
        } catch (error) {
          logger.error("Failed to fetch project summaries", error);
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
          } catch (error) {
            console.error("Error in getProjectSummaries.fulfilled:", error);
            state.isLoading = false;
          }
        },
        rejected: (state) => {
          if (!state) return;
          state.isLoading = false;
          state.projectSummaries = [];
        },
      },
    ),

    // Get all projects (legacy)
    getAllProjects: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        console.log("🔵 Fetching projects from API...");
        try {
          const data = await api.fetchProjects();
          return data;
        } catch (error) {
          logger.error("Failed to fetch projects", error);
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
        },
        rejected: (state) => {
          state.isLoading = false;
          state.projects = [];
        },
      },
    ),

    // Get members of a specific project
    getProjectMembers: create.asyncThunk(
      async (projectId: string, { rejectWithValue }) => {
        try {
          const data = await api.fetchProjectMembers(projectId);
          return data;
        } catch (error) {
          logger.error(
            `Failed to fetch members for project ${projectId}`,
            error,
          );
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
        },
      },
    ),

    // Create a new project
    createProject: create.asyncThunk(
      async (dto: CreateProjectDto, { rejectWithValue }) => {
        console.log("🔵 Creating project:", dto);
        try {
          const data = await api.fetchCreateProject(dto);
          return data;
        } catch (error) {
          logger.error("Failed to create project", error);
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
        try {
          const data = await api.fetchUpdateProject(id, { title, description });
          return data;
        } catch (error) {
          logger.error(`Failed to update project ${id}`, error);
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
          const updatedProject = action.payload;

          if (!updatedProject?.id) {
            return;
          }

          const projectIndex = state.projects?.findIndex(
            (p) => p.id === updatedProject.id,
          );
          if (
            projectIndex !== undefined &&
            projectIndex !== -1 &&
            state.projects
          ) {
            state.projects[projectIndex] = {
              ...state.projects[projectIndex],
              ...updatedProject,
            };
          }

          const summaryIndex = state.projectSummaries?.findIndex(
            (p) => p.id === updatedProject.id,
          );
          if (
            summaryIndex !== undefined &&
            summaryIndex !== -1 &&
            state.projectSummaries
          ) {
            state.projectSummaries[summaryIndex] = {
              ...state.projectSummaries[summaryIndex],
              title: updatedProject.title,
              description: updatedProject.description,
            };
          }

          if (
            state.currentProject &&
            state.currentProject.id === updatedProject.id
          ) {
            state.currentProject = {
              ...state.currentProject,
              title: updatedProject.title,
              description: updatedProject.description,
            };
          }

          state.isLoading = false;
          state.updateProjectSuccessMessage = "Project updated successfully!";

          setTimeout(() => {
            if (state) state.updateProjectSuccessMessage = "";
          }, 3000);
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
        try {
          await api.fetchDeleteProject(projectId);
          return projectId;
        } catch (error) {
          logger.error(`Failed to delete project ${projectId}`, error);
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
        try {
          const data = await api.fetchProjectById(projectId);
          return data;
        } catch (error) {
          logger.error(`Failed to fetch project ${projectId}`, error);
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
        rejected: (state) => {
          state.isLoading = false;
          state.currentProject = undefined;
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
        try {
          const data = await api.fetchInviteUser(projectId, dto);
          return data;
        } catch (error) {
          logger.error(`Failed to invite user to project ${projectId}`, error);
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
        try {
          const data = await api.fetchAcceptInvite(inviteToken);
          return data;
        } catch (error) {
          logger.error("Failed to accept invitation", error);
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
        try {
          const data = await api.fetchResendInvite(invitationId);
          return data;
        } catch (error) {
          logger.error(`Failed to resend invitation ${invitationId}`, error);
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
        try {
          const data = await api.fetchRevokeInvite(invitationId);
          return data;
        } catch (error) {
          logger.error(`Failed to revoke invitation ${invitationId}`, error);
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
