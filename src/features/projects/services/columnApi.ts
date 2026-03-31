import axiosInstance from "../../../lib/axiosInstance";

const COLUMNS_BASE_PATH = "/columns";

// Get all columns for a project
export const fetchColumnsByProject = async (projectId: string) => {
  const res = await axiosInstance.get(`${COLUMNS_BASE_PATH}/project/${projectId}`);
  return res.data;
};

// Create a new column
export const fetchCreateColumn = async (projectId: string, data: { name: string; order?: number }) => {
  const res = await axiosInstance.post(`${COLUMNS_BASE_PATH}/project/${projectId}`, data);
  return res.data;
};

// Update a column
export const fetchUpdateColumn = async (columnId: string, data: { name?: string; order?: number }) => {
  const res = await axiosInstance.patch(`${COLUMNS_BASE_PATH}/${columnId}`, data);
  return res.data;
};

// Delete a column
export const fetchDeleteColumn = async (columnId: string) => {
  const res = await axiosInstance.delete(`${COLUMNS_BASE_PATH}/${columnId}`);
  return res.data;
};

// Reorder columns
export const fetchReorderColumns = async (columnIds: string[]) => {
  const res = await axiosInstance.post(`${COLUMNS_BASE_PATH}/reorder`, { columnIds });
  return res.data;
};