import React, { useEffect, useState, useRef } from 'react';
import Globe from 'react-globe.gl'; // Import the Globe component
import axios from 'axios'; // For fetching satellite data

const GlobeComponent = ({ setOverpassData }) => {
  const globeRef = useRef();
  const [satellites, setSatellites] = useState([]);
  const [arcData, setArcData] = useState([]);

  // Fetch satellite data from backend
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get('http://localhost:3001/api/satellites')
        .then((response) => {
          setSatellites(response.data);

          // Create arcs for each satellite showing its path
          const arcs = response.data.map((satellite) => ({
            startLat: 0, // Starting point (equator)
            startLng: -140, // Longitude for equator start
            endLat: satellite.coordinates.lat, // Satellite current latitude
            endLng: satellite.coordinates.lng, // Satellite current longitude
          }));

          setArcData(arcs);
        })
        .catch((error) => console.error('Error fetching satellites:', error));
    }, 1000); // Update satellite data every second

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  // Function to handle globe click event and fetch overpass info
  const handleGlobeClick = ({ lat, lng }) => {
    console.log(`User clicked on latitude: ${lat}, longitude: ${lng}`);
    // Send clicked location to the backend to get overpasses for that location
    axios
      .get('http://localhost:3001/api/overpasses', {
        params: { lat, lng },
      })
      .then((response) => {
        setOverpassData(response.data); // Update overpass data for display
      })
      .catch((error) => console.error('Error fetching overpasses:', error));
  };

  return (
    <div className="globe-container" style={{ width: '100%', height: '500px' }}>
      <Globe
        ref={globeRef}
        globeImageUrl="/earth-night.png" // Path to the globe texture
        arcsData={arcData} // Satellite paths (arcs)
        arcColor={() => 'rgba(255, 0, 0, 0.7)'} // Color of arcs (more visible)
        arcStroke={0.4}
        arcAltitude={0.5}
        width="100%"
        height={500}
        atmosphereColor="#0000FF"
        atmosphereAltitude={0.4}
        backgroundColor="#101820"
        onGlobeClick={handleGlobeClick}
        pointsData={satellites.map((sat) => ({
          ...sat,
          lat: sat.coordinates.lat,
          lng: sat.coordinates.lng,
          color: 'blue',
          size: 0.4,
        }))}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointRadius="size"
        pointLabel={(sat) => sat.name}
      />
    </div>
  );
};

export default GlobeComponent;
