// src/features/projects/components/EditProjectForm.tsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  updateProject,
  selectUpdateProjectErrorMessage,
  selectUpdateProjectSuccessMessage,
  clearUpdateMessages,
} from "../slice/projectsSlice";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import type { ProjectSummary } from "../types";
import { logger } from "../../../lib/logger";

interface EditProjectFormProps {
  project: ProjectSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EditProjectForm: React.FC<EditProjectFormProps> = ({
  project,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector(selectUpdateProjectErrorMessage);
  const successMessage = useAppSelector(selectUpdateProjectSuccessMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: project?.title || "",
      description: project?.description || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, "Title must be at least 3 characters")
        .required("Title is required"),
      description: Yup.string()
        .min(3, "Description must be at least 3 characters")
        .required("Description is required"),
    }),
    onSubmit: async (values) => {
      if (!project?.id) {
        logger.error("No project id");
        return;
      }

      setIsSubmitting(true);
      try {
        await dispatch(updateProject({ id: project.id, ...values })).unwrap();
        onSuccess?.();
        onOpenChange(false);
      } catch (error) {
        logger.error("Error updating project:", error);
        alert("Failed to update project. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      dispatch(clearUpdateMessages());
      formik.resetForm();
    }
    onOpenChange(newOpen);
  };

  if (!project) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              {...formik.getFieldProps("title")}
              className={
                formik.touched.title && formik.errors.title
                  ? "border-red-500"
                  : ""
              }
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-sm text-red-500">{formik.errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              {...formik.getFieldProps("description")}
              className={
                formik.touched.description && formik.errors.description
                  ? "border-red-500"
                  : ""
              }
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-red-500">
                {formik.errors.description}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectForm;
