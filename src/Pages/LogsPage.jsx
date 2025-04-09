import { useState, useEffect } from 'react';
import axios from 'axios';

const LogsPage = () => {
  const [logs, setLogs] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('/api/logs');
        setLogs(response.data.logs);
      } catch (err) {
        setError('Failed to load logs');
      }
    };

    fetchLogs();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Logs</h2>
      <pre>{logs}</pre>
    </div>
  );
};

export default LogsPage;