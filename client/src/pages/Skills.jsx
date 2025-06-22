import React, { useEffect, useState } from "react";

function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/skills/")
      .then((r) => r.json())
      .then(setSkills);
  }, []);

  return (
    <div className="container">
    <h2>Available Skills</h2>
    {skills.map((skill) => (
      <div className="card" key={skill.id}>
        <h3>{skill.title}</h3>
        <p>{skill.description}</p>
        <p><strong>Offered by:</strong> {skill.user.username}</p>
      </div>
      ))}
    </div>
  );
}

export default Skills;
