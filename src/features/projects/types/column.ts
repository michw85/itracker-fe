export interface Column {
  id: string;
  name: string;
  order: number;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateColumnDto {
  name: string;
  order?: number;
}

export interface UpdateColumnDto {
  name?: string;
  order?: number;
}

export interface ColumnsSliceState {
  columns: Column[];
  isLoading: boolean;
  error?: string;
  successMessage?: string;
}