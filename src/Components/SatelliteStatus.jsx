import "../Styles/SatelliteStatus.css"; 
const SatelliteStatus = ({ satellites }) => {
  return (
    <div className="satellite-status">
      <h2 className="satellite-title">Available Satellites</h2>
      <div className="satellite-list">
        {satellites.map((satellite, index) => (
          <div key={index} className="satellite-entry">
            {satellite}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SatelliteStatus;