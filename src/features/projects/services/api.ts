import axiosInstance from "../../../lib/axiosInstance";
import type { CreateProjectDto } from "../types";

// we already added  prefix /api in axios config
// Base paths for API requests / Базовые пути для API запросов
const PROJECTS_BASE_PATH = "/projects";
const INVITATIONS_PATH = "/invitations";

// Get all projects / Получить все проекты
export const fetchProjects = async () => {
  const res = await axiosInstance.get(PROJECTS_BASE_PATH);
  return res.data;
};

// Create a new project / Создать новый проект
export const fetchCreateProject = async (projectDto: CreateProjectDto) => {
  const res = await axiosInstance.post(PROJECTS_BASE_PATH, projectDto);
  return res.data;
};

// Get project members / Получить участников проекта
export const fetchProjectMembers = async (projectId: string) => {
  const res = await axiosInstance.get(`${PROJECTS_BASE_PATH}/${projectId}/members`);
  return res.data;
};

// Invite a user to the project / Пригласить пользователя в проект
export const fetchInviteUser = async (projectId: string, inviteDto: InviteUserDto) => {
  const res = await axiosInstance.post(
    `${PROJECTS_BASE_PATH}/${projectId}/invitations`,
    inviteDto
  );
  return res.data;
};

// Accept invitation by token / Принять приглашение по токену
export const fetchAcceptInvite = async (inviteToken: string) => {
  const res = await axiosInstance.post(`${INVITATIONS_PATH}/accept?token=${inviteToken}`);
  return res.data;
};

// Resend invitation / Отправить повторное приглашение
export const fetchResendInvite = async (invitationId: number) => {
  const res = await axiosInstance.post(`${INVITATIONS_PATH}/${invitationId}/resend`);
  return res.data;
};

// Revoke invitation / Отозвать приглашение
export const fetchRevokeInvite = async (invitationId: number) => {
  const res = await axiosInstance.delete(`${INVITATIONS_PATH}/${invitationId}`);
  return res.data;
};
