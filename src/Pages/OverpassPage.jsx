import React, { useState, useEffect } from 'react';
import GlobeComponent from '../Components/GlobeComponent';
import SatelliteStatus from '../Components/SatelliteStatus';
import OverpassChecker from '../Components/OverpassComponent';
import axios from 'axios';
import '../Styles/OverpassPage.css';

const OverpassPage = () => {
  const [satellites, setSatellites] = useState([]);
  const [selectedSatellite, setSelectedSatellite] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/satellites')
      .then(response => setSatellites(response.data))
      .catch(error => console.error("Error fetching satellites:", error));
  }, []);

  return (
    <div className="overpass-page-main">
      <div className="globe-top">
        <GlobeComponent />
      </div>
      <div className="bottom-panels">
        <div className="satellite-status-container">
          <SatelliteStatus satellites={satellites} selected={selectedSatellite} />
        </div>
        <div className="right-panel">
          <OverpassChecker />
        </div>
      </div>
    </div>
  );
};

export default OverpassPage;