import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { forgotPassword } from "../services/api";
import { useState } from "react";
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
    <Card className="w-full max-w-sm mx-auto mt-10">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email to receive password reset Link
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
        {error && <div className="text-sm text-red-500 mb-6">{error}</div>}

        {isSend && (
          <div className="rounded-md bg-green-100 p-3 text-sm text-green-700 border border-green-200">
            Reset link sent successfully. Please check your inbox.
          </div>
        )}

        {!isSend && (
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
            <CustomInput
              id="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              {...formik.getFieldProps("email")}
              error={formik.errors.email}
            />
            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
