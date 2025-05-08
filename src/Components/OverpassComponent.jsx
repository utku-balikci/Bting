import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/OverpassComponent.css";

const OverpassChecker = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [overpass, setOverpass] = useState(null);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const res = await fetch("/capitals.geojson");
        const data = await res.json();
        const parsed = data.features.map((f) => ({
          name: f.properties.city ?? f.id,
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
        }));
        setCities(parsed);
        setSelectedCity(parsed[0]);
        setInputValue(parsed[0].name);
      } catch {
        setError("Failed to load city list.");
      }
    };
    loadCities();
  }, []);

  const fetchOverpass = async (city) => {
    if (!city) return;
    try {
      const res = await axios.get("http://localhost:3001/api/overpasses", {
        params: { lat: city.lat, lng: city.lng },
      });
      if (!res.data || !res.data.overpassTime) {
        setOverpass(null);
        return;
      }
      setOverpass({
        ...res.data,
        timeObj: new Date(res.data.overpassTime),
      });
      setError("");
    } catch {
      setOverpass(null);
      setError("Could not fetch overpass data.");
    }
  };

  useEffect(() => {
    if (selectedCity) fetchOverpass(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    const loadRecommendations = async () => {
      const topCities = cities.slice(0, 100);
      const res = await Promise.all(
        topCities.map(async (city) => {
          try {
            const r = await axios.get("http://localhost:3001/api/overpasses", {
              params: { lat: city.lat, lng: city.lng },
            });
            if (r.data && r.data.overpassTime) {
              const time = new Date(r.data.overpassTime);
              const diff = time - new Date();
              if (diff > 0 && diff < 60 * 60 * 1000) {
                return {
                  name: city.name,
                  overpassTime: time,
                };
              }
            }
          } catch {
            return null;
          }
        })
      );
      const sorted = res.filter(Boolean).sort((a, b) => a.overpassTime - b.overpassTime).slice(0, 6);
      setRecommendations(sorted);
    };
    if (cities.length) loadRecommendations();
  }, [cities]);

  const getCountdown = (date) => {
    if (!date) return null;
    const diff = date - new Date();
    if (diff < 0) return "Now";
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `in ${m}m ${s}s`;
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    const match = cities.find((c) =>
      c.name.toLowerCase() === e.target.value.toLowerCase()
    );
    if (match) setSelectedCity(match);
  };

  return (
    <div className="overpass-container">
      <h2>🛰️ Satellite Overpass Checker</h2>

      <input
        className="city-selector"
        placeholder="Search for a city"
        value={inputValue}
        onChange={handleInputChange}
        list="cities"
      />
      <datalist id="cities">
        {cities.map((c) => (
          <option key={c.name} value={c.name} />
        ))}
      </datalist>

      {overpass ? (
        <div className="overpass-details">
          <p><strong>City:</strong> {selectedCity.name}</p>
          <p><strong>Satellite:</strong> {overpass.satellite}</p>
          <p><strong>Next Overpass:</strong> {overpass.timeObj.toLocaleString()}</p>
          <p><strong>Countdown:</strong> {getCountdown(overpass.timeObj)}</p>
          <p><strong>Distance:</strong> {parseFloat(overpass.distance).toFixed(2)} km</p>
          <p><strong>Location:</strong> {overpass.lat}, {overpass.lng}</p>
        </div>
      ) : (
        <p className="error">{error || "No overpass found."}</p>
      )}

      {recommendations.length > 0 && (
        <div className="recommendations-box large">
          <h4>🔔 Upcoming Overpasses</h4>
          <ul>
            {recommendations.map((r, i) => (
              <li key={i} onClick={() => {
                const city = cities.find(c => c.name === r.name);
                if (city) {
                  setSelectedCity(city);
                  setInputValue(city.name);
                }
              }}>
                <span>{r.name}</span>
                <span className="countdown">{getCountdown(r.overpassTime)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OverpassChecker;