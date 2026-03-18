import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { forgotPassword } from "../services/api";
import { useState } from "react";

const ForgotPasswordForm = () => {
  const [isSend, setIsSend] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      try {
        await forgotPassword(values.email);
        setIsSend(true);
      } catch (err: unknown) {
        console.error(err);
        
        setError("Could not send reset email. Please try again.");
      }
    },
  });
  return (
    <div className="mx-auto max-w-sm space-y-6 p-6 rounded-lg border bg-white shadow-sm mt-10">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot Password
        </h1>
        <p className="text-sm text-muted-foreground text-gray-500">
          Enter your email to receive password reset Link
        </p>
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}
        {isSend && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
            Reset link sent successfully. Please check your inbox.
          </div>
        )}
      </div>

      {!isSend && (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
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
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-input"
              }`}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-500">{formik.errors.email}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send Reset Link
          </button>
        </form>
      )}
      <div className="text-center">
        <Link to="/login" className="text-sm text-blue-600 hover:underline">
          Back to Sign in{" "}
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
