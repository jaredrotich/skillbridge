import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Components & Pages
import Navbar from "./components/Navbar";
import Footer from "./pages/Footer";
import Skills from "./pages/Skills";
import NewSkill from "./pages/NewSkill";
import Requests from "./pages/Requests";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RequestSkill from "./pages/RequestSkill";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UsersList from "./pages/UsersList";
import ClientRequest from "./pages/ClientRequest";
import Home from "./pages/Home";


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/users/check_session", {
      credentials: "include", // To include cookies/session
    })
      .then((r) => {
        if (r.ok) return r.json();
        throw new Error("Unauthorized");
      })
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />

      <Routes>
         <Route path="/" element={<Home />} />
        <Route path="availableskills" element={<Skills />} />
        <Route path="/new" element={<NewSkill />} />
        <Route path="/requests" element={<Requests isAdmin={user?.is_admin} />} />
        <Route path="/clientrequest" element={<ClientRequest />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/request-skill/:id" element={<RequestSkill user={user} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
       

        <Route
          path="/userslist"
          element={user?.username === "admin" ? <UsersList /> : <Navigate to="/" />}
        />
      </Routes>

      {/*  show footer */}
      <Footer />
    </Router>
  );
}

export default App;


