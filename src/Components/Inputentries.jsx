import { useState } from "react";
import "../Styles/InputForm.css";

const Inputentries = ({ title, onSubmit }) => {
  const [formData, setFormData] = useState({ uptime: "", params: "", version: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.uptime || !formData.params || !formData.version) {
      alert("All fields must be filled out before submitting.");
      return;
    }

    onSubmit(formData);
    setFormData({ uptime: "", params: "", version: "" }); 
  };

  return (
    <div className="input-form">
      <h3 className="form-title">{title}</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="uptime">Uptime:</label>
        <input
          type="number"
          id="uptime"
          name="uptime"
          value={formData.uptime}
          onChange={handleChange}
          className="input-field"
          aria-label="Uptime input field"
          required
        />

        <label htmlFor="params">Params1:</label>
        <input
          type="text"
          id="params"
          name="params"
          value={formData.params}
          onChange={handleChange}
          className="input-field"
          aria-label="Params input field"
          required
        />

        <label htmlFor="version">Version:</label>
        <input
          type="text"
          id="version"
          name="version"
          value={formData.version}
          onChange={handleChange}
          className="input-field"
          aria-label="Version input field"
          required
        />

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default Inputentries;