import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

function Signup({ setUser }) {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        validationSchema={Yup.object({
          username: Yup.string().required("Username is required"),
          email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
          password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
        })}
        onSubmit={(values, { setSubmitting, setErrors }) => {
          fetch(`${API_BASE}/users/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(values),
          })
            .then(async (res) => {
              setSubmitting(false);
              const data = await res.json();

              if (res.ok) {
                setUser(data);
                navigate("/");
              } else {
                // Map error to relevant field or generic error
                if (data.error?.toLowerCase().includes("email")) {
                  setErrors({ email: data.error });
                } else if (data.error?.toLowerCase().includes("username")) {
                  setErrors({ username: data.error });
                } else {
                  setErrors({ password: data.error || "Signup failed." });
                }
              }
            })
            .catch((err) => {
              console.error("[FRONTEND SIGNUP ERROR]", err);
              setErrors({
                email: "Server error. Please try again later.",
              });
              setSubmitting(false);
            });
        }}
      >
        <Form>
          <div>
            <label>Username:</label>
            <Field name="username" />
            <ErrorMessage name="username" component="div" />
          </div>

          <div>
            <label>Email:</label>
            <Field name="email" type="email" />
            <ErrorMessage name="email" component="div" />
          </div>

          <div>
            <label>Password:</label>
            <Field name="password" type="password" />
            <ErrorMessage name="password" component="div" />
          </div>

          <button type="submit">Sign Up</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Signup;
