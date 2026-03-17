export interface Project {
  id: string;
  title: string;
  description: string;
  ownerId?: number;
}

// DTO without id / ДТО без id
export type CreateProjectDto = Omit<Project, "id">;

export type ProjectRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
export type InvitationStatus = "PENDING" | "ACTIVE" | "EXPIRED";

// Interface for project member (including invitations) / Интерфейс для участника проекта (включая приглашения)
export interface ProjectMember {
  id: number;
  email: string;
  role: ProjectRole;
  status: InvitationStatus;
  invitedAt: string;
  expiresAt?: string; // for PENDING invitations - expiration time / для PENDING приглашений 
  userId?: number; // for registered users / для зарегистрированных пользователей
}

// DTO for inviting a user / ДТО для приглашения пользователя
export interface InviteUserDto {
  email: string;
  role: Exclude<ProjectRole, "OWNER">; // cannot invite as OWNER / нельзя пригласить как OWNER
}

// Projects slice state / Состояние slice'а проектов
export interface ProjectsSliceState {
  projects: Project[];
  currentProject?: Project;
  members: ProjectMember[];
  createProjectErrorMessage?: string;
  inviteErrorMessage?: string;
  inviteSuccessMessage?: string;
  acceptInviteMessage?: string;
  isLoading: boolean;
}
