import { useFormik } from "formik";
import * as Yup from "yup";
import { register } from "../slice/authSlice";
import { useAppDispatch } from "../../../app/hooks";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { BackendErrorResponse } from "../types";
import { Button } from "../../../components/ui/button";
import { CustomInput } from "../../../components/shared";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

const RegistrationForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [serverPasswordErrors, setServerPasswordErrors] = useState<string[]>(
    [],
  );
  const [serverFormError, setServerFormError] = useState<string | null>(null);

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
        const payload = dispatchResult.payload as
          | BackendErrorResponse
          | undefined;

        if (payload) {
          setServerFormError(payload.message || "Registration failed");

          const passwordError = payload.errors?.find(
            (error) => error.field === "password",
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
    <Card className="w-full max-w-sm mx-auto mt-10">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your email address below, which will be used to log in to your
          account.
        </CardDescription>
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
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          {serverFormError && (
            <p className="text-sm text-red-500">{serverFormError}</p>
          )}
          {/* Email Field */}
          <CustomInput
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            {...formik.getFieldProps("email")}
            error={formik.errors.email}
          />

          {/* Password Field */}
          <CustomInput
            id="password"
            type="password"
            isViewSwitcher
            label="Password"
            placeholder="Create a password"
            {...formik.getFieldProps("password")}
            error={
              formik.touched.password && formik.errors.password ? (
                <p className="text-sm text-red-500">{formik.errors.password}</p>
              ) : serverPasswordErrors.length > 0 ? (
                <ul className="ml-6 list-disc">
                  {serverPasswordErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              ) : null
            }
          />
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
