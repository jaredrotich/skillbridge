import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function NewSkill() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Post a New Skill</h2>

      <Formik
        initialValues={{ title: "", description: "", user_id: "" }}
        validationSchema={Yup.object({
          title: Yup.string().required("Required"),
          description: Yup.string().required("Required"),
          user_id: Yup.number().required("User ID required"),
        })}
        onSubmit={(values, { resetForm }) => {
          fetch("http://localhost:5000/skills/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          })
            .then((r) => r.json())
            .then((data) => {
              alert("Skill created!");
              resetForm();
            });
        }}
      >
        <Form>
          <div>
            <label>Title:</label>
            <Field name="title" />
            <ErrorMessage name="title" component="div" />
          </div>

          <div>
            <label>Description:</label>
            <Field name="description" as="textarea" />
            <ErrorMessage name="description" component="div" />
          </div>

          <div>
            <label>Your User ID:</label>
            <Field name="user_id" />
            <ErrorMessage name="user_id" component="div" />
          </div>

          <button type="submit">Post Skill</button>
        </Form>
      </Formik>
    </div>
  );
}

export default NewSkill;
