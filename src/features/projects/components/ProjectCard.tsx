// src/features/projects/components/ProjectCard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Pencil, Trash2, MoreVertical } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import type { ProjectSummary } from "../types";

interface ProjectCardProps {
  project: ProjectSummary;
  userRole?: string | null;
  onDelete?: (projectId: string) => void;
  onEdit?: (project: ProjectSummary) => void;
  onManageMembers?: (project: ProjectSummary) => void;
  onClick?: () => void;
  isSelected?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  userRole,
  onDelete,
  onEdit,
  onManageMembers,
  onClick,
  isSelected,
}) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusVariant = (
    status: string,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "OPEN":
        return "default";
      case "CLOSED":
        return "secondary";
      case "ARCHIVED":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Determine which menu items to show depending on the role
  const canEdit = userRole === "OWNER" || userRole === "ADMIN";
  const canDelete = userRole === "OWNER";
  const canManageMembers = userRole === "OWNER" || userRole === "ADMIN";

  const getRoleBadgeVariant = (
    role: string,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case "OWNER":
        return "destructive";
      case "ADMIN":
        return "default";
      default:
        return "secondary";
    }
  };

  const handleCardClick = () => {
    onClick?.();
  };

  const handleOpenProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/projects/${project.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(project);
  };

  const handleManageMembersClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onManageMembers?.(project);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete?.(project.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card
        className={`group cursor-pointer transition-all hover:shadow-md hover:border-gray-300 overflow-hidden ${
          isSelected ? "ring-2 ring-blue-500 border-blue-500" : ""
        }`}
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg line-clamp-1 flex-1">
              {project.title}
            </CardTitle>

            {/* Status and Menu Container */}
            <div className="flex items-center gap-2">
              {/* Status Badge */}
              <Badge variant={getStatusVariant(project.status)}>
                {project.status}
              </Badge>

              {/* Dropdown Menu with three dots */}
              {(canManageMembers || canEdit || canDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canManageMembers && (
                      <DropdownMenuItem onClick={handleManageMembersClick}>
                        <Users className="mr-2 h-4 w-4" />
                        Members
                      </DropdownMenuItem>
                    )}
                    {canEdit && (
                      <DropdownMenuItem onClick={handleEditClick}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {canDelete && (
                      <DropdownMenuItem
                        onClick={handleDeleteClick}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {project.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-muted-foreground">Active tasks</p>
                <p className="text-xl font-semibold">
                  {project.activeTasksCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Executors</p>
                <p className="text-xl font-semibold">
                  {project.executorsCount}
                </p>
              </div>
            </div>

            {/* Role Badge */}
            {userRole && (
              <Badge
                variant={getRoleBadgeVariant(userRole)}
                className="text-xs"
              >
                {userRole}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <Button
            variant="default"
            className="w-full bg-black text-white hover:bg-gray-800"
            onClick={handleOpenProject}
          >
            OPEN
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>"{project.title}"</strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectCard;
