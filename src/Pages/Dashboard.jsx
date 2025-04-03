import { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import InputForm from "../Components/Inputentries";
import SatelliteStatus from "../Components/SatelliteStatus";
import NotesSection from "../Components/NotesSection";
import "../Styles/Dashboard.css";

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const satellites = ["Satellite A", "Satellite B", "Satellite C"];

  const saveEntryToBackend = async (entry) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.post("http://localhost:3001/api/entries", entry, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setEntries((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error("❌ Failed to save entry:", error.message);
    }
  };

  const handleFormSubmit = (newEntry) => {
    const timestamp = new Date().toLocaleString();
    const entryWithDate = { date: timestamp, ...newEntry };
    saveEntryToBackend(entryWithDate);
  };

  const handleDeleteEntry = async (id) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete(`http://localhost:3001/api/entries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries((prev) => prev.filter((entry) => entry._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete entry:", err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const res = await axios.get("http://localhost:3001/api/entries", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEntries(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
          console.error("❌ Failed to fetch entries:", error.message);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-layout">
        <Sidebar entries={entries} onDelete={handleDeleteEntry} />
        <div className="dashboard-main">
          <h2 className="dashboard-title">Enter Satellite Data</h2>
          <div className="input-wrapper">
            <div className="input-box">
              <InputForm title="SampleNode 1" onSubmit={handleFormSubmit} />
            </div>
            <div className="input-box">
              <InputForm title="SampleNode 2" onSubmit={handleFormSubmit} />
            </div>
          </div>
          <NotesSection />
        </div>
        <SatelliteStatus satellites={satellites} />
      </div>
    </div>
  );
};

export default Dashboard;