import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Login</h2>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={Yup.object({
          username: Yup.string().required("Required"),
          password: Yup.string().required("Required"),
        })}
        onSubmit={(values, { setSubmitting, setErrors }) => {
          fetch("http://localhost:5000/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }).then((r) => {
            setSubmitting(false);
            if (r.ok) {
              r.json().then((user) => {
                setUser(user);
                navigate("/");
              });
            } else {
              setErrors({ password: "Invalid username or password" });
            }
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
