import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../services/api";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { CustomInput } from "../../../components/shared";
import { Button } from "../../../components/ui/button";

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
        await resetPassword(token, values.password);
        setStatus({
          type: "success",
          msg: "Password reset! Redirecting to login...",
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
      <div className="rounded-md bg-red-100 p-3 text-sm text-red-700 border border-red-200">
        Invalid access. Please use the link provided in your email.
      </div>
    );
  }

  return (
    <Card className="w-full max-w-sm mx-auto mt-10">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
        <CardAction>
          <Link
            to="/login"
            className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
          >
            Sign in
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        {status && (
          <div
            className={`mb-6 ${
              status.type === "success"
                ? "rounded-md bg-green-100 p-3 text-sm text-green-700 border border-green-200"
                : "rounded-md bg-red-100 p-3 text-sm text-red-700 border border-red-200"
            }`}
          >
            {status.msg}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          <CustomInput
            id="new_password"
            type="password"
            isViewSwitcher
            label="New Password"
            placeholder="Enter new password"
            {...formik.getFieldProps("password")}
            error={formik.errors.password}
          />

          <CustomInput
            id="confirm_password"
            type="password"
            isViewSwitcher
            label="Confirm Password"
            placeholder="Confirm new password"
            {...formik.getFieldProps("confirmPassword")}
            error={formik.errors.confirmPassword}
          />

          <Button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full"
          >
            {formik.isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
