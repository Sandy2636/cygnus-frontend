"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "@/lib/axiosInstance";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// @ts-ignore
import sha256 from "sha256";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      let { username, password } = values;
      password = sha256(password);
      const response = await axios.post("/auth/login", { username, password });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.data.accessToken);
        // Redirect to home page on success
        router.push(`/my-profile/${response.data.data._id}`);
      }
    } catch (error: any) {
      // Show error message
      setErrorMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Field
                  as={Input}
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  className="mt-1"
                />
                {errors.username && touched.username && (
                  <p className="text-sm text-red-500 mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Field
                  as={Input}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="mt-1"
                />
                {errors.password && touched.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              {errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}

              <Button type="submit" className="w-full mt-4">
                Login
              </Button>
            </Form>
          )}
        </Formik>

        <div className="mt-4 text-center">
          <p>
            Not registered?{" "}
            <a href="/auth/register" className="text-blue-500 hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
