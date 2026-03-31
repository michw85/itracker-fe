import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  getColumnsByProject,
  createColumn,
  updateColumn,
  deleteColumn,
  clearColumnMessages,
  selectColumns,
  selectColumnsLoading,
  selectColumnsError,
  selectColumnsSuccess,
} from "../slice/columnsSlice";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { Pencil, Trash2, Plus, GripVertical } from "lucide-react";
import type { Column } from "../types/column";

interface ColumnManagerProps {
  projectId: string;
  isOwner: boolean;
}

const ColumnManager: React.FC<ColumnManagerProps> = ({
  projectId,
  isOwner,
}) => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectColumns);
  const isLoading = useAppSelector(selectColumnsLoading);
  const error = useAppSelector(selectColumnsError);
  const successMessage = useAppSelector(selectColumnsSuccess);

  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [editName, setEditName] = useState("");
  const [newColumnName, setNewColumnName] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteColumnId, setDeleteColumnId] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      dispatch(getColumnsByProject(projectId));
    }
    return () => {
      dispatch(clearColumnMessages());
    };
  }, [dispatch, projectId]);

  const handleAddColumn = async () => {
    if (!newColumnName.trim()) return;
    await dispatch(
      createColumn({ projectId, data: { name: newColumnName.trim() } }),
    );
    setNewColumnName("");
    setIsAddDialogOpen(false);
  };

  const handleEditColumn = async () => {
    if (!editingColumn || !editName.trim()) return;
    await dispatch(
      updateColumn({
        columnId: editingColumn.id,
        data: { name: editName.trim() },
      }),
    );
    setIsEditDialogOpen(false);
    setEditingColumn(null);
    setEditName("");
  };

  const handleDeleteColumn = async () => {
    if (!deleteColumnId) return;
    await dispatch(deleteColumn(deleteColumnId));
    setDeleteColumnId(null);
  };

  const openEditDialog = (column: Column) => {
    setEditingColumn(column);
    setEditName(column.name);
    setIsEditDialogOpen(true);
  };

  if (!isOwner) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
        Only project owner can manage columns
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Board Columns</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Column
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Column</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="columnName">Column Name</Label>
                <Input
                  id="columnName"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="e.g., In Progress, Review, Done"
                  onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddColumn}
                  disabled={!newColumnName.trim()}
                >
                  Add Column
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
          {successMessage}
        </div>
      )}

      {isLoading && columns.length === 0 ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <span className="ml-2 text-sm text-gray-500">Loading columns...</span>
        </div>
      ) : columns.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No columns yet. Add your first column!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                <span className="font-medium">{column.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEditDialog(column)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setDeleteColumnId(column.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Column</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editColumnName">Column Name</Label>
              <Input
                id="editColumnName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEditColumn()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditColumn} disabled={!editName.trim()}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteColumnId}
        onOpenChange={() => setDeleteColumnId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Column</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this column? All tasks in this
              column will be moved to another column or archived. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDeleteColumnId(null)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteColumn} variant="destructive">
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ColumnManager;
