import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogout() {
    fetch("http://localhost:5000/users/logout", {
      method: "DELETE",
      credentials: "include",
    }).then(() => {
      setUser(null);
      navigate("/login");
    });
  }

  return (
    <nav className="navbar">
      <Link to="/">Skills</Link>
      <Link to="/new">Post Skill</Link>
      <Link to="/requests">Requests</Link>

      {/*  Only show if user is logged in and is admin */}
      {user?.username === "admin" && (
        <Link to="/userslist" style={{ marginLeft: "1rem" }}>
          Manage Users
        </Link>
      )}

      {user ? (
        <>
          <span style={{ color: "white", marginLeft: "1rem" }}>
            Hello, {user.username}!
          </span>
          <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginLeft: "1rem" }}>Login</Link>
          <Link to="/signup" style={{ marginLeft: "1rem" }}>Sign Up</Link>
          <Link to="/forgot-password" style={{ marginLeft: "1rem" }}>
            Forgot Password
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
