import React, { useEffect, useState } from "react";
import SkillCard from "../components/SkillCard";

function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/skills/", {
      credentials: "include", // Needed for session-aware fetching
    })
      .then((r) => r.json())
      .then((data) => {
        console.log("Skills fetched:", data); 
        setSkills(data);
      });
  }, []);

  return (
    <div className="container">
      <h2>Available Skills</h2>
      {skills.map((skill) => (
        <div className="card" key={skill.id}>
          <h3>{skill.title}</h3>
          <p>{skill.description}</p>
          <p><strong>Offered by:</strong> {skill.user ? skill.user.username : "Unknown User"}</p>
        </div>
      ))}
    </div>
  );
}

export default Skills;
