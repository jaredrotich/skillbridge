import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: "1rem", background: "#333", color: "#fff" }}>
      <Link to="/" style={{ marginRight: "1rem", color: "#fff" }}>Skills</Link>
      <Link to="/new" style={{ marginRight: "1rem", color: "#fff" }}>Post Skill</Link>
      <Link to="/requests" style={{ color: "#fff" }}>Requests</Link>
    </nav>
  );
}

export default Navbar;
