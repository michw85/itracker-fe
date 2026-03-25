import { useFormik } from "formik";
import * as Yup from "yup";
import { login, selectLoginError } from "../slice/authSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Link, useNavigate } from "react-router-dom";
import { CustomInput } from "../../../components/shared";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loginError = useAppSelector(selectLoginError);

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
    onSubmit: async (values) => {
      const result = await dispatch(login(values));
      if (login.fulfilled.match(result)) {
        navigate("/projects");
      }
      // см в форме регистрации как сделать редирект в случае успешного выполнения запроса
    },
  });

  return (
    <Card className="w-full max-w-sm mx-auto mt-10">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to sign in
        </CardDescription>
        <CardAction>
          <Link
            to="/register"
            className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
          >
            Sign up
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          {loginError && (
            <div className="text-sm text-red-500">{loginError}</div>
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
            placeholder="Enter your password"
            {...formik.getFieldProps("password")}
            error={formik.errors.password}
          />
          <Button type="submit" className="w-full">
            Sing in
          </Button>
          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
