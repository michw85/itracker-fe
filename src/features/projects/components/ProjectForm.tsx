import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  createProject,
  selectCreateProjectErrorMessage,
} from "../slice/projectsSlice";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

interface ProjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const projectError = useAppSelector(selectCreateProjectErrorMessage);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, "Title must be at least 3 characters")
        .required("Title is required"),
      description: Yup.string()
        .min(3, "Description must be at least 3 characters")
        .required("Description is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      console.log("🔵 Submitting project:", values);
      try {
        const result = await dispatch(createProject(values)).unwrap();
        console.log("🟢 Project created:", result);
        resetForm();
        onSuccess?.();
      } catch (error) {
        console.error("🔴 Error creating project:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>New Project</DialogTitle>
      </DialogHeader>

      {projectError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {projectError}
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
            placeholder="New Website Development"
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
            placeholder="A Project to develop a new company website"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-sm text-red-500">{formik.errors.description}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default ProjectForm;
