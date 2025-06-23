import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogout() {
    fetch("http://localhost:5000/users/logout", {
      method: "DELETE",
    }).then(() => {
      setUser(null);
      navigate("/login");
    });
  }

  return (
    <nav>
      <Link to="/">Skills</Link>
      <Link to="/new">Post Skill</Link>
      <Link to="/requests">Requests</Link>
      {/* <Link to="/RequestSkill">RequestSkill</Link> */}
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
        </>
      )}
    </nav>
  );
}

export default Navbar;
