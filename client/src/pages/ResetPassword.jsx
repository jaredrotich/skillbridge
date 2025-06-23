import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/users/reset_password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then((r) => r.json())
      .then((data) => {
        setMsg(data.message || data.error);
        if (data.message) {
          setTimeout(() => navigate("/login"), 2000);
        }
      });
  };

  return (
    <div className="container">
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          value={password}
          placeholder="New password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Reset</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}

export default ResetPassword;
