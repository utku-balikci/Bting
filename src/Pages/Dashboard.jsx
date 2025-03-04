import { useState } from "react";
import Sidebar from "../Components/Sidebar";
import InputForm from "../Components/InputForm";
import SatelliteStatus from "../Components/SatelliteStatus";
import NotesSection from "../Components/NotesSection";
import "../Styles/Dashboard.css";

/*const fetchSatellites = async () => {
  try {
    const response = await fetch("/api/satellites");
    const data = await response.json();
    setSatellites(data); // Update state with latest satellite data
  } catch (error) {
    console.error("Error fetching satellites:", error);
  }
};*/

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const satellites = ["Satellite A", "Satellite B", "Satellite C"];

  const handleFormSubmit = (newEntry) => {
    const timestamp = new Date().toLocaleString();
    setEntries([...entries, { date: timestamp, ...newEntry }]);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-layout">
        {/* Sidebar (Left) */}
        <Sidebar entries={entries} />

        {/* Main Content (Center) */}
        <div className="dashboard-main">
          <h2 className="dashboard-title">Enter Satellite Data</h2>

          <div className="input-wrapper">
            <div className="input-box">
              <InputForm title="SampleNode 1" onSubmit={handleFormSubmit} />
            </div>
            <div className="input-box">
              <InputForm title="SampleNode 2" onSubmit={handleFormSubmit} />
            </div>
          </div>
          <NotesSection />
        </div>

        {/* Satellite Status (Right) */}
        <SatelliteStatus satellites={satellites} />
      </div>
    </div>
  );
};

export default Dashboard;