
import React, { useState } from "react";
import "./ClientRequest.css";

function ClientRequest() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    fetch("http://localhost:5000/requests/client-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to send request");
        return r.json();
      })
      .then(() => {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }

  return (
    <div className="container" style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Request a Service</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Service Request:</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          required
        />

        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Send Request"}
        </button>

        {status === "success" && (
          <p style={{ color: "green" }}>Request sent successfully! ✅</p>
        )}
        {status === "error" && (
          <p style={{ color: "red" }}>Error: {error}</p>
        )}
      </form>
    </div>
  );
}

export default ClientRequest;
