import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import CalendarPage from "./Pages/CalendarPage";
import SchedulePage from "./Pages/SchedulePage";
import Dashboard from "./Pages/Dashboard";
import Navbar from "./Components/NavBar";
import TermsAndConditions from "./Pages/ConditionsPage";
import Projects from "./Pages/ProjectsPage";
import LogsPage from "./Pages/LogsPage"; 
import OverpassPage from "./Pages/OverpassPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  useEffect(() => {
    // Only set to localStorage when the authentication status changes
    if (isAuthenticated !== (localStorage.getItem("isAuthenticated") === "true")) {
      localStorage.setItem("isAuthenticated", isAuthenticated);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <Router>
      <Navbar 
        isAuthenticated={isAuthenticated} 
        setIsAuthenticated={setIsAuthenticated} 
        handleLogout={handleLogout} 
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/conditions" element={<TermsAndConditions />} />
        <Route path="/log" element={isAuthenticated ? <LogsPage /> : <Navigate to="/login" />} /> {/* Make sure LogsPage exists */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/overpasses" element={<OverpassPage />} />
      </Routes>
    </Router>
  );
};

export default App;