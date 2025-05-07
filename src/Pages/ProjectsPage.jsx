import { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "Planned",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/projects");
      setProjects(response.data);
    } catch (err) {
      setError("Failed to fetch projects.");
    }
  };

  const handleInputChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.name) {
      setError("Project name is required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/api/projects", newProject);
      setProjects([response.data, ...projects]);
      setNewProject({ name: "", description: "", status: "Planned" });
      setError("");
    } catch (err) {
      setError("Failed to add project.");
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/projects/${id}`);
      setProjects(projects.filter((proj) => proj._id !== id));
    } catch (err) {
      setError("Failed to delete project.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:3001/api/projects/${id}`, { status: newStatus });
      setProjects((prev) =>
        prev.map((proj) =>
          proj._id === id ? { ...proj, status: newStatus } : proj
        )
      );
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  return (
    <div className="projects-container">
      <h2 className="projects-title">Project Catalog</h2>

      <form className="project-form" onSubmit={handleAddProject}>
        <input
          type="text"
          name="name"
          placeholder="Project name"
          value={newProject.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newProject.description}
          onChange={handleInputChange}
        />
        <select
          name="status"
          value={newProject.status}
          onChange={handleInputChange}
        >
          <option value="Planned">Planned</option>
          <option value="In Progress">In Progress</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">Add Project</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <div className="projects-list">
        {projects.map((project) => (
          <div
            key={project._id}
            className={`project-card ${project.status.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <h3>{project.name}</h3>
            <p>{project.description}</p>

            <select
              value={project.status}
              onChange={(e) => handleStatusChange(project._id, e.target.value)}
              className="status"
            >
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>

            {project.createdAt && (
              <p className="date-tag">
                Added: {new Date(project.createdAt).toLocaleDateString()}
              </p>
            )}

            <button
              className="delete-btn"
              onClick={() => handleDeleteProject(project._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;