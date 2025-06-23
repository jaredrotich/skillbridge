import React from "react";
import { Link } from "react-router-dom";
import "./SkillCard.css";

function SkillCard({ skill }) {
  return (
    <div className="skill-card">
      <h3 className="skill-title">{skill.title}</h3>
      <p className="skill-desc">{skill.description}</p>
      <p className="skill-offered">
        <strong>Offered by:</strong> {skill.user?.username || "Unknown"}
      </p>

      <Link to={`/request-skill/${skill.id}`} className="request-btn">
        Request This Skill
      </Link>
    </div>
  );
}

export default SkillCard;
