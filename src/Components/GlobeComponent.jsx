import React, { useEffect, useState, useRef } from 'react';
import Globe from 'react-globe.gl';
import axios from 'axios';

const GlobeComponent = ({ setOverpassData }) => {
  const globeRef = useRef();
  const [satellites, setSatellites] = useState([]);
  const [arcData, setArcData] = useState([]);
  const [labels, setLabels] = useState([]);

  // Fetch satellite data every second
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get('http://localhost:3001/api/satellites')
        .then((response) => {
          setSatellites(response.data);
          const arcs = response.data.map((sat) => ({
            startLat: 0,
            startLng: -140,
            endLat: sat.coordinates.lat,
            endLng: sat.coordinates.lng,
          }));
          setArcData(arcs);
        })
        .catch((error) => console.error('Error fetching satellites:', error));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch capital city labels only
  useEffect(() => {
    const loadCapitalLabels = async () => {
      try {
        const res = await fetch('/capitals.geojson');
        const data = await res.json();

        const capitalLabels = data.features.map((f) => ({
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
          text: f.properties.city ?? f.id,
          size: 0.5,
          color: 'rgba(218, 220, 240, 0.85)',
        }));

        setLabels(capitalLabels.slice(0, 200)); // limit if necessary
      } catch (err) {
        console.error('Error loading capital label data:', err);
      }
    };

    loadCapitalLabels();
  }, []);

  const handleGlobeClick = ({ lat, lng }) => {
    console.log(`User clicked on latitude: ${lat}, longitude: ${lng}`);
    axios
      .get('http://localhost:3001/api/overpasses', { params: { lat, lng } })
      .then((response) => {
        setOverpassData(response.data);
      })
      .catch((error) => console.error('Error fetching overpasses:', error));
  };

  return (
    <div className="globe-container" style={{ height: '500px' }}>
      <Globe
        ref={globeRef}
        globeImageUrl="/earth-night.png"
        arcsData={arcData}
        arcColor={() => 'rgba(255, 0, 0, 0.7)'}
        arcStroke={0.4}
        arcAltitude={0.5}
        width="100%"
        height={500}
        atmosphereColor="#0000FF"
        atmosphereAltitude={0.4}
        backgroundColor="#101820"
        onGlobeClick={handleGlobeClick}
        labelsData={labels}
        labelLat="lat"
        labelLng="lng"
        labelText="text"
        labelColor="color"
        labelSize="size"
        labelDotRadius={0.15}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointRadius="size"
        pointLabel={(sat) => sat.name}
        pointsData={satellites.map((sat) => ({
          ...sat,
          lat: sat.coordinates.lat,
          lng: sat.coordinates.lng,
          color: 'blue',
          size: 0.4,
        }))}
      />
    </div>
  );
};

export default GlobeComponent;