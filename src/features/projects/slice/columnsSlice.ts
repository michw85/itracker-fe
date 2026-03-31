import { createAppSlice } from "../../../app/createAppSlice";
import type { CreateColumnDto, UpdateColumnDto, ColumnsSliceState } from "../types/column";
import * as api from "../services/columnApi";
import { AxiosError } from "axios";
import { logger } from "../../../lib/logger";

const initialState: ColumnsSliceState = {
  columns: [],
  isLoading: false,
};

export const columnsSlice = createAppSlice({
  name: "columns",
  initialState,
  reducers: (create) => ({
    // Get columns by project
    getColumnsByProject: create.asyncThunk(
      async (projectId: string, { rejectWithValue }) => {
        try {
          const data = await api.fetchColumnsByProject(projectId);
          return data;
        } catch (error) {
          logger.error("Failed to fetch columns", error);
          const apiError = error as AxiosError<{ message?: string }>;
          return rejectWithValue(
            apiError.response?.data?.message || apiError.message || "Failed to fetch columns"
          );
        }
      },
      {
        pending: (state) => {
          state.isLoading = true;
          state.error = undefined;
        },
        fulfilled: (state, action) => {
          state.isLoading = false;
          state.columns = action.payload;
        },
        rejected: (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // Create a new column
    createColumn: create.asyncThunk(
      async ({ projectId, data }: { projectId: string; data: CreateColumnDto }, { rejectWithValue }) => {
        try {
          const newColumn = await api.fetchCreateColumn(projectId, data);
          return newColumn;
        } catch (error) {
          logger.error("Failed to create column", error);
          const apiError = error as AxiosError<{ message?: string }>;
          return rejectWithValue(
            apiError.response?.data?.message || apiError.message || "Failed to create column"
          );
        }
      },
      {
        pending: (state) => {
          state.isLoading = true;
          state.error = undefined;
        },
        fulfilled: (state, action) => {
          state.isLoading = false;
          state.columns = [...state.columns, action.payload].sort((a, b) => a.order - b.order);
          state.successMessage = "Column created successfully!";
          setTimeout(() => {
            state.successMessage = undefined;
          }, 3000);
        },
        rejected: (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // Update a column
    updateColumn: create.asyncThunk(
      async ({ columnId, data }: { columnId: string; data: UpdateColumnDto }, { rejectWithValue }) => {
        try {
          const updatedColumn = await api.fetchUpdateColumn(columnId, data);
          return updatedColumn;
        } catch (error) {
          logger.error("Failed to update column", error);
          const apiError = error as AxiosError<{ message?: string }>;
          return rejectWithValue(
            apiError.response?.data?.message || apiError.message || "Failed to update column"
          );
        }
      },
      {
        pending: (state) => {
          state.isLoading = true;
          state.error = undefined;
        },
        fulfilled: (state, action) => {
          state.isLoading = false;
          const index = state.columns.findIndex((col) => col.id === action.payload.id);
          if (index !== -1) {
            state.columns[index] = action.payload;
          }
          state.successMessage = "Column updated successfully!";
          setTimeout(() => {
            state.successMessage = undefined;
          }, 3000);
        },
        rejected: (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // Delete a column
    deleteColumn: create.asyncThunk(
      async (columnId: string, { rejectWithValue }) => {
        try {
          await api.fetchDeleteColumn(columnId);
          return columnId;
        } catch (error) {
          logger.error("Failed to delete column", error);
          const apiError = error as AxiosError<{ message?: string }>;
          return rejectWithValue(
            apiError.response?.data?.message || apiError.message || "Failed to delete column"
          );
        }
      },
      {
        pending: (state) => {
          state.isLoading = true;
          state.error = undefined;
        },
        fulfilled: (state, action) => {
          state.isLoading = false;
          state.columns = state.columns.filter((col) => col.id !== action.payload);
          state.successMessage = "Column deleted successfully!";
          setTimeout(() => {
            state.successMessage = undefined;
          }, 3000);
        },
        rejected: (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // Clear messages
    clearColumnMessages: create.reducer((state) => {
      state.error = undefined;
      state.successMessage = undefined;
    }),
  }),
  selectors: {
    selectColumns: (state) => state.columns,
    selectColumnsLoading: (state) => state.isLoading,
    selectColumnsError: (state) => state.error,
    selectColumnsSuccess: (state) => state.successMessage,
  },
});

export const {
  getColumnsByProject,
  createColumn,
  updateColumn,
  deleteColumn,
  clearColumnMessages,
} = columnsSlice.actions;

export const {
  selectColumns,
  selectColumnsLoading,
  selectColumnsError,
  selectColumnsSuccess,
} = columnsSlice.selectors;