import "../Styles/Sidebar.css";

const Sidebar = ({ entries }) => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Submitted Data</h2>

      <div className="sidebar-entries">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <div key={index} className="entry-item">
              <p><strong>📅 Date:</strong> {entry.date}</p>
              <ul>
                <li><strong>⏳ Uptime:</strong> {entry.uptime}</li>
                <li><strong>📊 Params1:</strong> {entry.params}</li>
                <li><strong>🔢 Version:</strong> {entry.version}</li>
              </ul>
            </div>
          ))
        ) : (
          <p className="no-entries">No data submitted yet.</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;