import { Link, useNavigate } from "react-router-dom"; 
import { auth, signOut } from "../firebaseConfig";
import "../Styles/NavBar.css";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">Satellite Dashboard</div>

      <div className="nav-links">
        <Link to="/overpasses">Overpasses</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/conditions">Conditions</Link>
        <Link to="/log">Log</Link>
        {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}  
      </div>

      <div className="nav-right">
        <Link to="/" className="nav-btn">Home</Link>
        {isAuthenticated ? (
          <button className="nav-btn logout-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login" className="nav-btn">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;