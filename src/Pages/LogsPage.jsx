import { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import "../Styles/LogsPage.css"; 

const LogsPage = () => {
  const [logs, setLogs] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      // Listen for changes in the user's authentication state
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            // Get the token directly from the authenticated user
            const token = await user.getIdToken();

            // Fetch logs from the backend with the token in the header
            const response = await axios.get("http://localhost:3001/api/logs", {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.status !== 200) {
              throw new Error("Failed to fetch logs");
            }

            setLogs(response.data.logs);
          } catch (err) {
            setError("Failed to load logs: " + err.message);
          }
        } else {
          setError("User is not authenticated.");
        }
      });

      // Cleanup function
      return () => unsubscribe();
    };

    fetchLogs();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="logs-page">
      <h2>Logs</h2>
      <pre className="logs-content">{logs}</pre>
    </div>
  );
};

export default LogsPage;