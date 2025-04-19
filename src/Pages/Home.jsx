import "../Styles/Home.css"; 
import { Link } from "react-router-dom";
import satelliteImage from "/NASA-Earth-observing-satellite-fleet.en.jpg"; // Ensure correct path

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Satellite Dashboard</h1>
      <p className="home-text">
        Monitor satellite activity, check available satellites, and input data with ease.
      </p>
      <img src={satelliteImage} alt="Satellite" className="home-image" />
      <p className="home-description">
        This dashboard provides real-time data and insights on various satellites orbiting the Earth.
      </p>
      <Link to="/dashboard">
        <button className="primary">Go to Dashboard</button>
      </Link>
    </div>
  );
};

export default Home;