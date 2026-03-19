import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  inviteUser,
  selectInviteErrorMessage,
  selectInviteSuccessMessage,
  clearInviteMessages,
} from "../slice/projectsSlice";
import type { ProjectRole } from "../types";
import { useEffect } from "react";

interface InviteUserFormProps {
  projectId: string;
}

const InviteUserForm = ({ projectId }: InviteUserFormProps) => {
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector(selectInviteErrorMessage);
  const successMessage = useAppSelector(selectInviteSuccessMessage);

  const formik = useFormik({
    initialValues: {
      email: "",
      role: "MEMBER" as Exclude<ProjectRole, "OWNER">,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      role: Yup.string()
        .oneOf(["ADMIN", "MEMBER", "VIEWER"], "Select a role")
        .required("Role is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(inviteUser({ projectId, dto: values })).unwrap();
        resetForm();
      } catch (error) {
        console.error("Error inviting user:", error);
      }
    },
  });

  // Clear messages on unmount
  useEffect(() => {
    return () => {
      dispatch(clearInviteMessages());
    };
  }, [dispatch]);

  return (
    <div className="bg-white rounded-lg border p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Invite Member</h3>

      {successMessage && (
        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {errorMessage}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...formik.getFieldProps("email")}
            className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring ${
              formik.touched.email && formik.errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-input"
            }`}
            placeholder="user@example.com"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-sm text-red-500">{formik.errors.email}</p>
          )}
        </div>

        {/* Role Field */}
        <div className="space-y-2">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Role
          </label>
          <select
            id="role"
            {...formik.getFieldProps("role")}
            className="w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring border-input"
          >
            <option value="ADMIN">Administrator</option>
            <option value="MEMBER">Member</option>
            <option value="VIEWER">Viewer</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            <span className="font-medium">Administrator:</span> can manage
            members
            <br />
            <span className="font-medium">Member:</span> can create and edit
            tasks
            <br />
            <span className="font-medium">Viewer:</span> view only
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send Invitation
        </button>
      </form>
    </div>
  );
};

export default InviteUserForm;
