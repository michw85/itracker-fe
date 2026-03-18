import { useFormik } from "formik";
import * as Yup from "yup";
import { register } from "../slice/authSlice";
import { useAppDispatch } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { BackendErrorResponse } from "../types";

const RegistrationForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const[serverPasswordErrors, setServerPasswordErrors] = useState<string[]>([]);
  const[serverFormError, setServerFormError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setServerPasswordErrors([]);
      setServerFormError(null);
      console.log("registration");
      const dispatchResult = await dispatch(register(values));
      if (register.fulfilled.match(dispatchResult)) {
        // if successful, it wiil navigate to login page
        navigate("/login");
        return;
      }

      if (register.rejected.match(dispatchResult)) {
        const payload = dispatchResult.payload as BackendErrorResponse | undefined;

        if (payload) {
          setServerFormError(payload.message || "Registration failed");

          const passwordError = payload.errors?.find(
            (error) => error.field === "password"
          );

          if (passwordError?.messages.length) {
            setServerPasswordErrors(passwordError.messages);
          }
        } else {
          setServerFormError("Registration failed");
        }
      }

      setSubmitting(false);
    },
  });

  return (
    <div className="mx-auto max-w-sm space-y-6 p-6 rounded-lg border bg-white shadow-sm mt-10">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground text-gray-500">
          Enter your email and password to register
        </p>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {serverFormError && (
          <p className="text-sm text-red-500">{serverFormError}</p>
        )}
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
            className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring ${
              formik.touched.email && formik.errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-input"
            }`}
            placeholder="you@example.com"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-sm text-red-500">{formik.errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formik.values.password}
            onChange={(e) => {
              if (serverPasswordErrors.length > 0 || serverFormError) {
                setServerPasswordErrors([]);
                setServerFormError(null);
              }
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring ${
              (formik.touched.password && formik.errors.password) ||
              serverPasswordErrors.length > 0
                ? "border-red-500 focus:ring-red-500"
                : "border-input"
            }`}
            placeholder="••••••••"
          />
          {formik.touched.password && formik.errors.password ? (
            <p className="text-sm text-red-500">{formik.errors.password}</p>
          ) : serverPasswordErrors.length > 0 ? (
            <ul className="text-sm text-red-500 space-y-1">
              {serverPasswordErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
