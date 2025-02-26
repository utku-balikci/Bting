import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/SchedulePage.css";

const SchedulePage = () => {
  const [satelliteName, setSatelliteName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  const handleAddEvent = () => {
    if (!satelliteName || !date || !time || !note) {
      alert("Udfyld alle felter.");
      return;
    }

    // Fix time zone offset before storing
    const eventDate = new Date(date);
    eventDate.setMinutes(eventDate.getMinutes() - eventDate.getTimezoneOffset());
    const storedDate = eventDate.toISOString().split("T")[0];

    const newEvent = { satelliteName, date: storedDate, time, note };
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    storedEvents.push(newEvent);
    localStorage.setItem("events", JSON.stringify(storedEvents));

    navigate("/calendar"); 
  };

  return (
    <div className="schedule-container">
      <h2>🛰️ Planlæg Satellitbegivenhed</h2>
      <div className="event-form">
        <input
          type="text"
          placeholder="Satellit Navn"
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
          placeholder="Beskrivelse af begivenheden"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button onClick={handleAddEvent} className="submit-button">➕ Tilføj Begivenhed</button>
      </div>
    </div>
  );
};

export default SchedulePage;