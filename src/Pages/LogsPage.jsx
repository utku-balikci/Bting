import { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import "../Styles/LogsPage.css";

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [methodFilters, setMethodFilters] = useState([]);
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await axios.get("http://localhost:3001/api/logs", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status !== 200) throw new Error("Failed to fetch logs");

          const rawLogs = response.data.logs;
          const logsArray = Array.isArray(rawLogs)
            ? rawLogs
            : rawLogs.split('\n').filter(line => line.trim() !== '');

          setLogs(logsArray);
          setFilteredLogs(logsArray);
        } catch (err) {
          setError("Failed to load logs: " + err.message);
        }
      } else {
        setError("User is not authenticated.");
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleMethodFilter = (method) => {
    setMethodFilters((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    if (!value) return setDateFilter("");
    // Match format like '2025-04-09'
    setDateFilter(value);
  };

  useEffect(() => {
    let updated = logs;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      updated = updated.filter((log) => log.toLowerCase().includes(q));
    }

    if (methodFilters.length > 0) {
      updated = updated.filter((log) =>
        methodFilters.some((method) => log.includes(method))
      );
    }

    if (dateFilter) {
      updated = updated.filter((log) => log.includes(dateFilter));
    }

    setFilteredLogs(updated);
  }, [searchQuery, logs, methodFilters, dateFilter]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="logs-page-container">
      <div className="logs-header">
        <h2>System Logs</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-group">
        {["GET", "POST", "PUT", "DELETE"].map((method) => (
          <label key={method}>
            <input
              type="checkbox"
              checked={methodFilters.includes(method)}
              onChange={() => toggleMethodFilter(method)}
            />
            {method}
          </label>
        ))}
        <input type="date" onChange={handleDateChange} />
      </div>

      <div className="logs-container">
        {filteredLogs.length === 0 ? (
          <div className="no-logs">No logs found.</div>
        ) : (
          <ul className="logs-list">
            {filteredLogs.map((log, index) => (
              <li key={index} className="log-entry">{log}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LogsPage;