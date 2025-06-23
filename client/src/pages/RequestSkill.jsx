import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function RequestSkill({ user }) {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRequest = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/requests/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        requester_id: user.id,
        skill_id: id,
        message,
      }),
    })
      .then((r) => {
        if (r.ok) return r.json();
        throw new Error("Request failed");
      })
      .then(() => navigate("/requests"))
      .catch((err) => {
        console.error("Request error:", err);
        setError("Could not send request. Please try again.");
      });
  };

  return (
    <div className="container">
      <h2>Request This Skill</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleRequest}>
        <label>Message:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Send Request</button>
      </form>
    </div>
  );
}

export default RequestSkill;
