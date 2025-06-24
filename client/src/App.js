// src/App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Skills from "./pages/Skills";
import NewSkill from "./pages/NewSkill";
import Requests from "./pages/Requests";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RequestSkill from "./pages/RequestSkill";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UsersList from "./pages/UsersList";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/users/check_session", {
      credentials: "include", // Important for cookies/session
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new Error("Unauthorized");
      })
      .then(setUser)
      .catch(() => setUser(null));
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
        <Route path="/request-skill/:id" element={<RequestSkill user={user} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/userslist"
          element={
            user?.username === "admin" ? <UsersList /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
