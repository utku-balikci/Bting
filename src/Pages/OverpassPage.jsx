import React, { useState, useEffect } from 'react';
import GlobeComponent from '../Components/GlobeComponent';  // Import the Globe component
import SatelliteStatus from '../Components/SatelliteStatus'; // Import SatelliteStatus component
import axios from 'axios'; // For fetching data from backend
import '../Styles/OverpassPage.css'; // Import the CSS styles

const OverpassPage = () => {
  const [satellites, setSatellites] = useState([]);
  const [selectedSatellite, setSelectedSatellite] = useState(null);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [overpassData, setOverpassData] = useState(null);

  // Fetch satellite data from backend
  useEffect(() => {
    axios.get('http://localhost:3001/api/satellites')
      .then(response => {
        setSatellites(response.data);
      })
      .catch(error => console.error("Error fetching satellites:", error));
  }, []);

  // Handle globe click to fetch overpasses for that location
  const handleLocationClick = async (lat, lng) => {
    try {
      const response = await axios.get('http://localhost:3001/api/overpasses', {
        params: { lat, lng }
      });
      setOverpassData(response.data);
    } catch (error) {
      console.error("Error fetching overpasses:", error);
    }
  };

  // Handle manual input of lat/lng
  const handleInputSubmit = async () => {
    if (lat && lng) {
      try {
        const response = await axios.get('http://localhost:3001/api/overpasses', {
          params: { lat, lng }
        });
        setOverpassData(response.data);
      } catch (error) {
        console.error("Error fetching overpasses:", error);
      }
    } else {
      alert("Please provide valid latitude and longitude values.");
    }
  };

  return (
    <div className="overpass-page-container">
      <div className="overpass-page-header">
        <h2>Satellite Overpasses</h2>
      </div>

      <div className="overpass-page-main">
        {/* Globe Component */}
        <div className="globe-container">
          <GlobeComponent setOverpassData={setOverpassData} />
        </div>

        {/* Satellite Info */}
        <div className="satellite-status-container">
          <SatelliteStatus satellites={satellites} selected={selectedSatellite} />
        </div>

        {/* Location Input */}
        <div className="location-input-container">
          <input
            type="number"
            placeholder="Enter Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            step="0.01"
            className="location-input"
          />
          <input
            type="number"
            placeholder="Enter Longitude"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            step="0.01"
            className="location-input"
          />
          <button onClick={handleInputSubmit} className="submit-location-btn">
            Get Overpass Data
          </button>
        </div>

        {/* Display Overpass Data */}
        {overpassData && (
          <div className="overpass-data-container">
            <h3>Overpass Data</h3>
            <div className="overpass-info">
              {overpassData.length === 0 ? (
                <p>No overpasses found for this location.</p>
              ) : (
                overpassData.map((overpass, index) => (
                  <div key={index} className="overpass-card">
                    <h4>{overpass.satellite}</h4>
                    <p>Overpass Time: {new Date(overpass.overpassTime).toLocaleString()}</p>
                    <p>Distance: {overpass.distance} km</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverpassPage;