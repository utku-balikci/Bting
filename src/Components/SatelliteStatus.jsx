import { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/SatelliteStatus.css";
import SatelliteMap from "../Components/satelliteMap"; 

const SatelliteStatus = () => {
  const [satellites, setSatellites] = useState([]);
  const [selected, setSelected] = useState(null);

  // Fetch satellite data only when the refresh button is clicked or a satellite is selected
  const fetchSatellites = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/satellites");
      setSatellites(res.data.filter((s) => s.active)); 
    } catch (err) {
      console.error("❌ Failed to fetch satellites:", err.message);
    }
  };

  useEffect(() => {
    fetchSatellites();  // Initial fetch on component mount
    const interval = setInterval(async () => {
      await fetchSatellites(); // Periodically fetch satellite data
    }, 1000);
    
    return () => clearInterval(interval); // Clean up interval when the component is unmounted
  }, []);

  return (
    <div className="satellite-status">
      <h2 className="satellite-title">Active Satellites</h2>
      <button onClick={fetchSatellites} className="refresh-btn">
        🔄 Refresh
      </button>

      {/* List active satellites */}
      <div className="satellite-list">
        {satellites.map((sat) => (
          <button
            key={sat.id}
            className={`satellite-entry ${selected?.id === sat.id ? "selected" : ""}`}
            onClick={() => setSelected(sat)}
          >
            🛰 {sat.name}
          </button>
        ))}
      </div>

      {/* Show selected satellite details */}
      {selected && (
        <div className="satellite-popup">
          <div className="popup-content">
            <h3>📡 {selected.name}</h3>
            <p>🟢 Status: {selected.status}</p>
            <p> ID: {selected.id}</p>
            <p>Velocity: {selected.velocity} km/h</p>
            <p>Altitude: {selected.altitude} km</p>
            <p>Temperature: {selected.temperature} °C</p>
            <p>🔋 Battery: {selected.battery}%</p>
            <p>📍 Location: {selected.coordinates.lat}, {selected.coordinates.lng}</p>

            {/* Satellite map */}
            <SatelliteMap satellite={selected} />

            <button className="close-btn" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SatelliteStatus;