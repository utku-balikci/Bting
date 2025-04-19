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
      axios.get('http://localhost:3001/api/satellites')
        .then(response => {
          setSatellites(response.data);

          // Create arcs for each satellite showing its path
          const arcs = response.data.map(satellite => ({
            startLat: 0, // Starting point (equator)
            startLng: -140, // Longitude for equator start
            endLat: satellite.coordinates.lat,  // Satellite current latitude
            endLng: satellite.coordinates.lng,  // Satellite current longitude
          }));

          setArcData(arcs);
        })
        .catch(error => console.error("Error fetching satellites:", error));
    }, 1000); // Update satellite data every second

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  // Function to handle globe click event and fetch overpass info
  const handleGlobeClick = ({ lat, lng }) => {
    console.log(`User clicked on latitude: ${lat}, longitude: ${lng}`);
    // Send clicked location to the backend to get overpasses for that location
    axios.get('http://localhost:3001/api/overpasses', {
      params: { lat, lng }
    })
    .then(response => {
      setOverpassData(response.data); // Update overpass data for display
    })
    .catch(error => console.error("Error fetching overpasses:", error));
  };

  return (
    <div className="globe-container" style={{ width: '100%', height: '500px' }}>
      <Globe
        ref={globeRef}
        globeImageUrl={'/earth-night.png'} // Path to the globe texture
        arcsData={arcData} // Satellite paths (arcs)
        arcColor={() => 'rgba(255, 0, 0, 0.7)'} // Color of arcs (more visible)
        arcWidth={3}  // Make arcs thicker for better visibility
        arcAltitude={0.3}  // Increase arc height for better visibility
        arcDashLength={2}  // Make arcs dashed
        arcDashGap={2}  // Add more space between the dashes for better visibility
        showGraticules={true}  // Show latitude/longitude lines
        showAtmosphere={true}  // Show atmosphere around the globe
        labelsData={satellites.map(sat => ({
          lat: sat.coordinates.lat,
          lng: sat.coordinates.lng,
          label: sat.name,  // Satellite names as labels
        }))}
        labelColor="blue"  // Change label color to blue for better contrast
        pointOfView={{ lat: 0, lng: -140, altitude: 2 }} // Initial view
        width="100%" // Full width of the window
        height={500} // Fixed height for the globe
        atmosphereColor="#0000FF" // Adjust atmosphere color
        atmosphereAltitude={0.5} // Adjust atmosphere altitude
        backgroundColor="#101820" // Dark background color for better contrast
        onGlobeClick={handleGlobeClick} // Handle globe click to capture location
        pointsData={satellites.map(sat => ({
          lat: sat.coordinates.lat,
          lng: sat.coordinates.lng,
          size: 0.4, // Size of the satellite dots
          color: 'blue', // Satellite dot color
        }))} // Display satellites as points on the globe
      />
    </div>
  );
};

export default GlobeComponent;