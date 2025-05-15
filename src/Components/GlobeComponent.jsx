import React, { useEffect, useState, useRef } from 'react';
import Globe from 'react-globe.gl';
import axios from 'axios';

const GlobeComponent = ({ setOverpassData }) => {
  const globeRef = useRef();
  const [satellites, setSatellites] = useState([]);
  const [arcData, setArcData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch satellite data every second
  useEffect(() => {
    const fetchSatellites = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/satellites');
        const satellitesData = response.data;

        setSatellites(satellitesData);

        const arcs = satellitesData.map((sat) => ({
          startLat: 0,
          startLng: -140,
          endLat: sat.coordinates.lat,
          endLng: sat.coordinates.lng,
        }));
        setArcData(arcs);
      } catch (error) {
        console.error('Error fetching satellites:', error);
      }
    };

    const interval = setInterval(fetchSatellites, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch capital city labels
  useEffect(() => {
    const loadCapitalLabels = async () => {
      try {
        const response = await fetch('/capitals.geojson');
        const data = await response.json();

        const capitalLabels = data.features.map((feature) => ({
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
          text: feature.properties.city ?? feature.id,
          size: 0.5,
          color: 'rgba(218, 220, 240, 0.85)',
        }));

        setLabels(capitalLabels.slice(0, 200)); // Limit to 200 labels if necessary
      } catch (error) {
        console.error('Error loading capital label data:', error);
      }
    };

    loadCapitalLabels();
  }, []);

  return (
    <div className="globe-container" style={{ position: 'relative', width: '100%', height: '500px' }}>
      <Globe
        ref={globeRef}
        globeImageUrl="/earth-night.png"
        arcsData={arcData}
        arcColor={() => 'rgba(255, 0, 0, 0.7)'}
        arcStroke={0.4}
        arcAltitude={0.5}
        width={window.innerWidth}
        height={500}
        atmosphereColor="#0000FF"
        atmosphereAltitude={0.4}
        backgroundColor="#101820"
        labelsData={labels}
        labelLat="lat"
        labelLng="lng"
        labelText="text"
        labelColor="color"
        labelSize="size"
        labelDotRadius={0.15}
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

      {/* Globe Clock Display */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: 12,
          color: 'lightblue',
          fontFamily: 'monospace',
          fontSize: '14px',
        }}
      >
        {currentTime.toLocaleString()}
      </div>
    </div>
  );
};

export default GlobeComponent;