import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig"; 
import axios from "axios";
import "../Styles/SchedulePage.css";

const SchedulePage = () => {
  const [satelliteName, setSatelliteName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  // Handler for form submission
  const handleAddEvent = async () => {
    if (!satelliteName || !date || !time || !note) {
      alert("Please fill in all fields.");
      return;
    }

    // Get Firebase user token
    const token = await auth.currentUser.getIdToken();

    const newEvent = { satelliteName, date, time, note };

    try {
      // Send POST request with Firebase token in the header
      const response = await axios.post(
        "http://localhost:3001/api/events",
        newEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Event added successfully:", response.data);
      navigate("/calendar"); // Redirect to calendar after event is added
    } catch (error) {
      console.error("Failed to add event:", error.message);
    }
  };

  return (
    <div className="schedule-container">
      <h2>🛰️ Plan Satellite Event</h2>
      <div className="event-form">
        <input
          type="text"
          placeholder="Satellite Name"
          value={satelliteName}
          onChange={(e) => setSatelliteName(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <textarea
          placeholder="Event Description"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button onClick={handleAddEvent} className="submit-button">
          ➕ Add Event
        </button>
      </div>
    </div>
  );
};

export default SchedulePage;