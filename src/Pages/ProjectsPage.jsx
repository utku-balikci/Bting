import { useState } from "react";
import "../Styles/Projects.css";

const Projects = () => {
  // Sample projects data
  const [projects] = useState([
    {
      name: "Satellite Mapping System",
      description: "A system to visualize satellite data in real-time.",
      status: "Active",
    },
    {
      name: "AI-Powered Image Recognition",
      description: "Using AI to analyze satellite images and detect patterns.",
      status: "In Progress",
    },
    {
      name: "Weather Prediction Model",
      description: "Predicting weather patterns using satellite data and machine learning.",
      status: "Completed",
    },
    {
      name: "Ground Communication System",
      description: "Developing a robust communication system for satellites.",
      status: "Planned",
    },
  ]);

  return (
    <div className="projects-container">
      <h2 className="projects-title">Project Catalog</h2>
      <div className="projects-list">
        {projects.map((project, index) => (
          <div key={index} className={`project-card ${project.status.toLowerCase()}`}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <span className="status">{project.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;