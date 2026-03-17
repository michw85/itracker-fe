import { createAppSlice } from "../../../app/createAppSlice";
import type {
  CreateProjectDto,
  ProjectsSliceState,
  InviteUserDto,
  ProjectMember,
} from "../types";
import * as api from "../services/api";
import { isAxiosError, type AxiosError } from "axios";

const initialState: ProjectsSliceState = {
  projects: [],
  members: [],
  isLoading: false,
};

export const projectsSlice = createAppSlice({
  name: "projects",
  initialState,
  reducers: (create) => ({
    // Get all projects / Получить все проекты
    getAllProjects: create.asyncThunk(
      async () => {
        return api
          .fetchProjects()
          .catch((err: AxiosError<{ message: string }>) => {
            // раскрываем ошибку от аксиоса и получаем сообщение
            // бросаем новую ошибку, которая поподет в rejected case
            throw new Error(err.response?.data?.message);
          });
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, action) => {
          state.isLoading = false;
          state.projects = action.payload;
        },
        rejected: (state, action) => {
          state.isLoading = false;
          state.projects = [];
          console.log(action.error);
        },
      },
    ),

    // Get members of a specific project / Получить участников конкретного проекта
    getProjectMembers: create.asyncThunk(
      async (projectId: string) => {
        return api.fetchProjectMembers(projectId);
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
          console.log(action.error);
        },
      },
    ),

    // Create a new project / Создать новый проект
    createProject: create.asyncThunk(
      async (dto: CreateProjectDto) => {
        return api.fetchCreateProject(dto).catch((err) => {
          if (isAxiosError(err)) {
            throw new Error(
              err.response?.data?.message || "Internal Server Error",
            );
          }
        });
        // The value we return becomes the `fulfilled` action payload
      },
      {
        pending: (state) => {
          // TODO add spinner here
          state.createProjectErrorMessage = "";
        },
        fulfilled: (state, action) => {
          state.projects.push(action.payload);
          state.createProjectErrorMessage = "";
        },
        rejected: (state, action) => {
          state.createProjectErrorMessage = action.error.message;
        },
      },
    ),

    // Invite a user to the project / Пригласить пользователя в проект
    inviteUser: create.asyncThunk(
      async ({ projectId, dto }: { projectId: string; dto: InviteUserDto }) => {
        return api.fetchInviteUser(projectId, dto);
      },
      {
        pending: (state) => {
          state.inviteErrorMessage = "";
          state.inviteSuccessMessage = "";
        },
        fulfilled: (state, action) => {
          // Add new member to the list with PENDING status / Добавляем нового участника в список с статусом PENDING
          state.members.push(action.payload);
          state.inviteSuccessMessage =
            "Invitation sent — pending registration or confirmation (valid for 72 hours)";
          state.inviteErrorMessage = "";
        },
        rejected: (state, action) => {
          state.inviteErrorMessage =
            action.error.message || "Error sending invitation";
          state.inviteSuccessMessage = "";
        },
      },
    ),

    // Accept invitation / Принять приглашение
    acceptInvite: create.asyncThunk(
      async (inviteToken: string) => {
        return api.fetchAcceptInvite(inviteToken);
      },
      {
        fulfilled: (state, action) => {
          // Update member status in the list if exists / Обновляем статус участника в списке, если он есть
          const memberIndex = state.members.findIndex(
            (m) => m.id === action.payload.id,
          );
          if (memberIndex !== -1) {
            state.members[memberIndex] = action.payload;
          }
          state.acceptInviteMessage = "You have successfully joined the project";
        },
        rejected: (state, action) => {
          state.acceptInviteMessage =
            "Invitation expired or invalid";
        },
      },
    ),

    // Resend invitation / Отправить повторное приглашение
    resendInvite: create.asyncThunk(
      async (invitationId: number) => {
        return api.fetchResendInvite(invitationId);
      },
      {
        fulfilled: (state, action) => {
          // Update invitation info (new expiration time) / Обновляем информацию о приглашении (новое время истечения)
          const memberIndex = state.members.findIndex(
            (m) => m.id === action.payload.id,
          );
          if (memberIndex !== -1) {
            state.members[memberIndex] = action.payload;
          }
          state.inviteSuccessMessage = "Invitation resent successfully";
        },
        rejected: (state, action) => {
          state.inviteErrorMessage =
            action.error.message || "Error resending invitation";
        },
      },
    ),

    // Revoke invitation / Отозвать приглашение
    revokeInvite: create.asyncThunk(
      async (invitationId: number) => {
        return api.fetchRevokeInvite(invitationId);
      },
      {
        fulfilled: (state, action) => {
          // Remove invitation from the list / Удаляем приглашение из списка
          state.members = state.members.filter((m) => m.id !== action.payload);
          state.inviteSuccessMessage = "Invitation revoked";
        },
        rejected: (state, action) => {
          state.inviteErrorMessage =
            action.error.message || "Error revoking invitation";
        },
      },
    ),

    // Clear invitation messages / Очистить сообщения о приглашениях
    clearInviteMessages: create.reducer((state) => {
      state.inviteErrorMessage = "";
      state.inviteSuccessMessage = "";
      state.acceptInviteMessage = "";
    }),
  }),

  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectProjects: (state) => state.projects,
    selectProjectMembers: (state) => state.members,
    selectIsLoading: (state) => state.isLoading,
    selectCreateProjectErrorMessage: (state) => state.createProjectErrorMessage,
    selectInviteErrorMessage: (state) => state.inviteErrorMessage,
    selectInviteSuccessMessage: (state) => state.inviteSuccessMessage,
    selectAcceptInviteMessage: (state) => state.acceptInviteMessage,
  },
});

// // Action creators are generated for each case reducer function.
export const {
  createProject,
  getAllProjects,
  getProjectMembers,
  inviteUser,
  acceptInvite,
  resendInvite,
  revokeInvite,
  clearInviteMessages,
} = projectsSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
  selectProjects,
  selectProjectMembers,
  selectIsLoading,
  selectCreateProjectErrorMessage,
  selectInviteErrorMessage,
  selectInviteSuccessMessage,
  selectAcceptInviteMessage,
} = projectsSlice.selectors;
