import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";
const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<{
    type: "loading" | "success" | "error";
    msg: string;
  } | null>(null);

  const token = searchParams.get("token");

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      if (!token) {
        setStatus({
          type: "error",
          msg: "Invalid or missing reset token.",
        });
        return;
      }
      try {
        await resetPassword( token,values.password );
        setStatus({
          type: "success",
          msg: "✅ Password reset! Redirecting to login...",
        });
        setTimeout(() => navigate("/login"), 3000);
      } catch (err: unknown) {
        console.error("Reset error:", err);
        setStatus({
          type: "error",
          msg: "Failed to reset password. Please try again.",
        });
      }
    },
  });
  if (!token) {
    return (
      <div className="mx-auto max-w-sm p-6 text-center text-red-600 bg-red-50 border border-red-200 rounded-lg mt-10">
        Invalid access. Please use the link provided in your email.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 p-6 rounded-lg border bg-white shadow-sm mt-10">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset Password
        </h1>
        <p className="text-sm text-gray-500">Enter your new password below</p>
        {status && (
          <div
            className={`rounded-md p-3 text-sm border ${
              status.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {status.msg}
          </div>
        )}
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>

          <input
            type="password"
            {...formik.getFieldProps("password")}
            className={`w-full px-3 py-2 text-sm border rounded-md ${
              formik.touched.password && formik.errors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-input"
            }`}
            placeholder="Enter new password"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-sm text-red-500">{formik.errors.password}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>

          <input
            type="password"
            {...formik.getFieldProps("confirmPassword")}
            className={`w-full px-3 py-2 text-sm border rounded-md ${
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? "border-red-500 focus:ring-red-500"
                : "border-input"
            }`}
            placeholder="Confirm new password"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {formik.errors.confirmPassword}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-zinc-800 transition-colors disabled:bg-gray-400"
        >
          {formik.isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
