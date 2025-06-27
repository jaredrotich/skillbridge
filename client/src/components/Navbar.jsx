
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

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
      <div className="navbar-left">
        <Link to="/" className="logo">SkillBridge</Link>
        <Link to="/new">Post Skill</Link>
        <Link to="/availableskills">Skills</Link>
        <Link to="/requests">Requests</Link>
        <Link to="/clientrequest">Client Request</Link>
        {user?.username === "admin" && <Link to="/userslist">Manage Users</Link>}
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <span className="greeting">Hi, {user.username}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <div
            className="dropdown"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <span className="dropdown-toggle">Accounts ▾</span>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
                <Link to="/forgot-password">Forgot Password</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
