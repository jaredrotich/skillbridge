import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

function Login({ setUser }) {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Login</h2>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={Yup.object({
          username: Yup.string().required("Username is required"),
          password: Yup.string().required("Password is required"),
        })}
        onSubmit={(values, { setSubmitting, setErrors }) => {
          fetch(`${API_BASE}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", 
            body: JSON.stringify(values),
          })
            .then(async (res) => {
              setSubmitting(false);
              if (res.ok) {
                const user = await res.json();
                setUser(user);
                navigate("/");
              } else {
                setErrors({ password: "Invalid username or password" });
              }
            })
            .catch(() =>
              setErrors({ password: "Server error. Try again later." })
            );
        }}
      >
        <Form>
          <div>
            <label>Username:</label>
            <Field name="username" />
            <ErrorMessage name="username" component="div" />
          </div>

          <div>
            <label>Password:</label>
            <Field name="password" type="password" />
            <ErrorMessage name="password" component="div" />
          </div>

          <button type="submit">Login</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Login;
