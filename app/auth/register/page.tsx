"use client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "@/lib/axiosInstance";
// @ts-ignore
import sha256 from "sha256";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RegistrationSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Register() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (values: {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
  }) => {
    try {
      let { password, ...rest } = values;
      password = sha256(password);
      const response = await axios.post("/auth/register", {
        password,
        ...rest,
      });
      if (response.data.status == "success") {
        // Redirect to login page on success
        router.push("/auth/login");
      }
    } catch (error: any) {
      // Show error message
      setErrorMessage(error.response?.data?.msg || "An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Register</h1>
        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            username: "",
            password: "",
          }}
          validationSchema={RegistrationSchema}
          onSubmit={handleRegister}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Field
                  as={Input}
                  id="first_name"
                  name="first_name"
                  placeholder="Enter your first name"
                  className="mt-1"
                />
                {errors.first_name && touched.first_name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Field
                  as={Input}
                  id="last_name"
                  name="last_name"
                  placeholder="Enter your last name"
                  className="mt-1"
                />
                {errors.last_name && touched.last_name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.last_name}
                  </p>
                )}
              </div>

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
                Register
              </Button>
            </Form>
          )}
        </Formik>

        <div className="mt-4 text-center">
          <p>
            Already registered?{" "}
            <a href="/auth/login" className="text-blue-500 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
