import axiosInstance from "../../../lib/axiosInstance";
import type { CreateProjectDto, InviteUserDto, ProjectSummary } from "../types";

const PROJECTS_BASE_PATH = "/projects";
const INVITATIONS_PATH = "/invitations";

// Get project summaries for dashboard
export const fetchProjectSummaries = async (): Promise<ProjectSummary[]> => {
  const res = await axiosInstance.get(`${PROJECTS_BASE_PATH}/dashboard`);
  return res.data;
};

// Get all projects
export const fetchProjects = async () => {
  const res = await axiosInstance.get(PROJECTS_BASE_PATH);
  return res.data;
};

// Get project by ID
export const fetchProjectById = async (projectId: string) => {
  const res = await axiosInstance.get(`${PROJECTS_BASE_PATH}/${projectId}`);
  return res.data;
};

// Create a new project
export const fetchCreateProject = async (projectDto: CreateProjectDto) => {
  const res = await axiosInstance.post(PROJECTS_BASE_PATH, projectDto);
  return res.data;
};

// Get project members
export const fetchProjectMembers = async (projectId: string) => {
  const res = await axiosInstance.get(
    `${PROJECTS_BASE_PATH}/${projectId}/members`,
  );
  return res.data;
};

// Check user role in project
export const checkUserRole = async (projectId: string) => {
  const res = await axiosInstance.get(
    `${PROJECTS_BASE_PATH}/${projectId}/my-role`,
  );
  return res.data;
};

// Invite a user to the project
export const fetchInviteUser = async (
  projectId: string,
  inviteDto: InviteUserDto,
) => {
  const res = await axiosInstance.post(
    `${PROJECTS_BASE_PATH}/${projectId}/invitations`,
    inviteDto,
  );
  return res.data;
};

// Accept invitation by token
export const fetchAcceptInvite = async (inviteToken: string) => {
  const res = await axiosInstance.post(
    `${INVITATIONS_PATH}/accept?token=${inviteToken}`,
  );
  return res.data;
};

// Resend invitation
export const fetchResendInvite = async (invitationId: number) => {
  const res = await axiosInstance.post(
    `${INVITATIONS_PATH}/${invitationId}/resend`,
  );
  return res.data;
};

// Revoke invitation
export const fetchRevokeInvite = async (invitationId: number) => {
  const res = await axiosInstance.delete(`${INVITATIONS_PATH}/${invitationId}`);
  return res.data;
};
