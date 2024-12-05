"use client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "@/lib/axiosInstance";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ProfileSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  date_of_birth: Yup.date().required("Date of Birth is required").nullable(),
  contact: Yup.string()
    .matches(/^\d{10}$/, "Contact must be a valid 10-digit number")
    .required("Contact is required"),
});

export default function Profile() {
  const router = useRouter();
  const params = useParams();
  const [initialValues, setInitialValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    contact: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) return router.push("/auth/login");
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/users/getUser", {
          params: {
            user_id: params.user_id,
          },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        setInitialValues((prev) => ({ ...prev, ...response.data.data }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async (values: typeof initialValues) => {
    try {
      const response = await axios.put("/users/saveUser", values, {
        params: {
          user_id: params.user_id,
        },
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.status === 200) {
        alert("Profile updated successfully!");
        router.push("/");
      }
    } catch (error) {
      alert("Error saving profile information.");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          User Profile
        </h1>
        <Formik
          initialValues={initialValues}
          validationSchema={ProfileSchema}
          onSubmit={handleSave}
          enableReinitialize
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
                <Label htmlFor="email">Email</Label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="mt-1"
                />
                {errors.email && touched.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Field
                  as={Input}
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  className="mt-1"
                />
                {errors.date_of_birth && touched.date_of_birth && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.date_of_birth}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="contact">Contact</Label>
                <Field
                  as={Input}
                  id="contact"
                  name="contact"
                  placeholder="Enter your contact number"
                  className="mt-1"
                />
                {errors.contact && touched.contact && (
                  <p className="text-sm text-red-500 mt-1">{errors.contact}</p>
                )}
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="w-full">
                  Save
                </Button>
                {/* <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push("/")}
                  className="w-full"
                >
                  Go to Dashboard
                </Button> */}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
