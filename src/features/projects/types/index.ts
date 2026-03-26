export interface Project {
  id: string;
  title: string;
  description: string;
  ownerId?: number;
}

export interface ProjectSummary {
  id: string;
  title: string;
  description: string;
  activeTasksCount: number;
  executorsCount: number;
  status: "OPEN" | "CLOSED" | "ARCHIVED";
}

// DTO without id
export type CreateProjectDto = Omit<Project, "id">;

export type ProjectRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
export type InvitationStatus = "PENDING" | "ACTIVE" | "EXPIRED";

// Interface for project member (including invitations)
export interface ProjectMember {
  id: number;
  email: string;
  role: ProjectRole;
  status: InvitationStatus;
  invitedAt: string;
  expiresAt?: string; // for PENDING invitations - expiration time
  userId?: number; // for registered users
  avatarUrl?: string;
}

// DTO for inviting a user
export interface InviteUserDto {
  email: string;
  role: Exclude<ProjectRole, "OWNER">; // cannot invite as OWNER
}

// Projects slice state
export interface ProjectsSliceState {
  projects: Project[];
  projectSummaries: ProjectSummary[];
  currentProject?: ProjectSummary;
  members: ProjectMember[];
  createProjectErrorMessage?: string;
  updateProjectErrorMessage?: string;
  updateProjectSuccessMessage?: string;
  inviteErrorMessage?: string;
  inviteSuccessMessage?: string;
  acceptInviteMessage?: string;
  isLoading: boolean;
}
