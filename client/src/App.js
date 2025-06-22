import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Skills from "./pages/Skills";
import NewSkill from "./pages/NewSkill";
import Requests from "./pages/Requests";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Skills />} />
        <Route path="/new" element={<NewSkill />} />
        <Route path="/requests" element={<Requests />} />
      </Routes>
    </Router>
  );
}

export default App;
