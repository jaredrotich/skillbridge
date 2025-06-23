import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

function Signup({ setUser }) {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        validationSchema={Yup.object({
          username: Yup.string().required("Required"),
          email: Yup.string().email("Invalid email").required("Required"),
          password: Yup.string().min(6).required("Required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          fetch("http://localhost:5000/users/signup", {
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
