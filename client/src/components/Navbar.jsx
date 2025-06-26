
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
      <div className="navbar-left">
        <Link to="/" className="nav-link">Skills</Link>
        <Link to="/new" className="nav-link">Post Skill</Link>
        <Link to="/requests" className="nav-link">Requests</Link>
        <Link to="/clientrequest" className="nav-link">ClientRequest</Link>
        {user?.username === "admin" && (
          <Link to="/userslist" className="nav-link">Manage Users</Link>
        )}
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <span className="user-greeting">Hello, {user.username}!</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
            <Link to="/forgot-password" className="nav-link">Forgot Password</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
