import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// Your Google Maps API key (ensure it's properly loaded in the browser)
const GOOGLE_MAPS_API_KEY = 'AIzaSyBD0VhO3iNaFXOv85wNV7k1TZjBIz4PMHc';

// Define container styles for the map
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
    const loadAdvancedMarkers = async () => {
      // Load the Google Maps API libraries for 'maps' and 'marker'
      await google.maps.importLibrary("maps");
      await google.maps.importLibrary("marker");

      // Create a map instance
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: center,
        mapId: "DEMO_MAP_ID", // Map ID is required for advanced markers
      });

      // Create the advanced marker
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
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

    loadAdvancedMarkers(); 
  }, [satellite]);

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={4}
        options={{
          mapTypeId: 'roadmap', // Set the map type to satellite or roadmap
          disableDefaultUI: true, // Disable default UI for a clean map
          streetViewControl: false, // Disable street view control
        }}
      >
        {/* This div will hold the map */}
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
      </GoogleMap>
    </LoadScript>
  );
};

export default SatelliteMap;