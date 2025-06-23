import React, { useEffect, useState } from "react";
import SkillCard from "../components/SkillCard"; 

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/skills/", {
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch skills");
        return r.json();
      })
      .then((data) => {
        setSkills(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching skills:", err);
        setError("Could not load skills. Try again later.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <h2>Available Skills</h2>

      {loading && <p>Loading skills...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {skills.length === 0 && !loading && !error && <p>No skills available yet.</p>}
     <div className="skill-grid">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
      </div>
    </div>
  );
}

export default Skills;
