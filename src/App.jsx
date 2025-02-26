import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import CalendarPage from "./Pages/CalendarPage";
import SchedulePage from "./Pages/SchedulePage";
import Dashboard from "./Pages/Dashboard";
import Navbar from "./Components/NavBar";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
      </Routes>
    </Router>
  );
};

export default App;