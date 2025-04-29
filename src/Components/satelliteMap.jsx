import React, { useEffect } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBD0VhO3iNaFXOv85wNV7k1TZjBIz4PMHc';
const MAP_ID = 'DEMO_MAP_ID'; // Replace with your actual mapId if needed

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '10px',
  border: '2px solid #3b82f6',
};

const SatelliteMap = ({ satellite }) => {
  const center = {
    lat: satellite.coordinates.lat,
    lng: satellite.coordinates.lng,
  };

  useEffect(() => {
    const loadAdvancedMarker = async () => {
      await google.maps.importLibrary('maps');
      await google.maps.importLibrary('marker');

      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center,
        mapId: MAP_ID,
      });

      new google.maps.marker.AdvancedMarkerElement({
        map,
        position: center,
        title: satellite.name,
        label: {
          text: satellite.name,
          color: 'black',
          fontSize: '14px',
          fontWeight: 'bold',
        },
      });
    };

    loadAdvancedMarker();
  }, [satellite]);

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      {/* This div is required for manual Google Maps injection */}
      <div id="map" style={containerStyle}></div>
    </LoadScript>
  );
};

export default SatelliteMap;