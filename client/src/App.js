import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Skills from "./pages/Skills";
import NewSkill from "./pages/NewSkill";
import Requests from "./pages/Requests";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/users/check_session")
      .then((r) => {
        if (r.ok) {
          r.json().then(setUser);
        }
      });
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Skills />} />
        <Route path="/new" element={<NewSkill />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
