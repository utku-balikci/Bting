import "../Styles/Sidebar.css";

const Sidebar = ({ entries, onDelete }) => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Submitted Data</h2>

      <div className="sidebar-entries">
        {Array.isArray(entries) && entries.length > 0 ? (
          entries.map((entry) => (
            <div key={entry._id} className="entry-item">
              <div className="entry-content">
                <p><strong>📅 Date:</strong> {entry.date}</p>
                <ul>
                  <li><strong>⏳ Uptime:</strong> {entry.uptime}</li>
                  <li><strong>📊 Params1:</strong> {entry.params}</li>
                  <li><strong>🔢 Version:</strong> {entry.version}</li>
                </ul>
              </div>
              <button className="delete-btn" onClick={() => onDelete(entry._id)}>x</button>
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