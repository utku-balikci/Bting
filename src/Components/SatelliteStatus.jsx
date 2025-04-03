import { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/SatelliteStatus.css";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom red dot marker
const redDotIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div class="red-dot"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const SatelliteStatus = () => {
  const [satellites, setSatellites] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchSatellites = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/satellites");
      setSatellites(res.data.filter((s) => s.active));
    } catch (err) {
      console.error("❌ Failed to fetch satellites:", err.message);
    }
  };

  useEffect(() => {
    fetchSatellites();
    const interval = setInterval(fetchSatellites, 10000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="satellite-status">
      <h2 className="satellite-title">Active Satellites</h2>
      <button onClick={fetchSatellites} className="refresh-btn">🔄 Refresh</button>

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

      {selected && (
        <div className="satellite-popup">
          <div className="popup-content">
            <h3>📡 {selected.name}</h3>
            <p>🟢 Status: {selected.status}</p>
            <p>ID: {selected.id}</p>
            <p>Velocity: {selected.velocity} km/h</p>
            <p>Altitude: {selected.altitude} km</p>
            <p>🌡 Temperature: {selected.temperature} °C</p>
            <p>🔋 Battery: {selected.battery}%</p>
            <p>📍 Location: {selected.coordinates.lat}, {selected.coordinates.lng}</p>

            <MapContainer
              center={[selected.coordinates.lat, selected.coordinates.lng]}
              zoom={4}
              scrollWheelZoom={false}
              style={{
                height: "300px",
                width: "200px",
                marginTop: "10px",
                borderRadius: "10px",
                overflow: "hidden",
                border: "2px solid #3b82f6"
              }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[selected.coordinates.lat, selected.coordinates.lng]}
                icon={redDotIcon}
              >
                <Tooltip direction="right" offset={[10, 0]} permanent>
                  🛰 {selected.name}
                </Tooltip>
              </Marker>
            </MapContainer>

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