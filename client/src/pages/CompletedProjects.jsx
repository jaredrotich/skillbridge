import React, { useEffect, useState } from "react";
import "./Requests.css";

function CompletedProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/requests/completed")
      .then((r) => r.json())
      .then(setProjects)
      .catch(console.error);
  }, []);

  return (
    <div className="requests-container">
      <h2 className="requests-heading">✅ Completed Projects</h2>

      {projects.length === 0 ? (
        <p className="no-requests">No completed projects yet.</p>
      ) : (
        projects.map((proj) => (
          <div className="request-card" key={proj.id}>
            <p><strong>Client:</strong> {proj.name}</p>
            <p><strong>Message:</strong> {proj.message}</p>
            <p><strong>Feedback:</strong> {proj.feedback || "None"}</p>
            {proj.project_link && (
              <p>
                <a
                  href={proj.project_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0077cc", textDecoration: "underline" }}
                >
                  🔗 View Project
                </a>
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default CompletedProjects;
