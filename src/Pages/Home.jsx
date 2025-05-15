import "../Styles/Home.css";
import { Link } from "react-router-dom";
import satelliteVideo from "/vid.mp4"; // Replace with your video file

const Home = () => {
  return (
    <div className="home-hero">
      <video autoPlay loop muted className="video-background">
        <source src={satelliteVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay" />
      <div className="home-content">
        <h1 className="home-title">Welcome to the Satellite Dashboard</h1>
        <p className="home-text">
          Real-time data, monitoring, and event planning – all in one place.
        </p>
        <Link to="/dashboard">
          <button className="primary-button">🚀 Go to Dashboard</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;