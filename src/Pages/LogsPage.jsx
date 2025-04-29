import { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import "../Styles/LogsPage.css"; 

const LogsPage = () => {
  const [logs, setLogs] = useState([]);            // ✅ must be array
  const [filteredLogs, setFilteredLogs] = useState([]); // ✅ must be array
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
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

            if (response.status !== 200) {
              throw new Error("Failed to fetch logs");
            }

            const backendLogs = response.data.logs;
            const logsArray = Array.isArray(backendLogs)
              ? backendLogs
              : backendLogs.split('\n').filter(line => line.trim() !== ''); // Split string logs to array if needed

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
    };

    fetchLogs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLogs(logs);
    } else {
      const lowerSearch = searchQuery.toLowerCase();
      const filtered = logs.filter(log => log.toLowerCase().includes(lowerSearch));
      setFilteredLogs(filtered);
    }
  }, [searchQuery, logs]);

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

      <div className="logs-container">
        {filteredLogs.length === 0 ? (
          <div className="no-logs">No logs found.</div>
        ) : (
          <ul className="logs-list">
            {filteredLogs.map((log, index) => (
              <li key={index} className="log-entry">
                {log}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LogsPage;