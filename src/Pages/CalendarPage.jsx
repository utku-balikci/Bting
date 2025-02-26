import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CalendarComponent from "../Components/CalendarComponent";
import "../Styles/CalendarPage.css";

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  // Fix timezone offset issue
  const formattedDate = new Date(date);
  formattedDate.setMinutes(formattedDate.getMinutes() - formattedDate.getTimezoneOffset());
  const selectedDate = formattedDate.toISOString().split("T")[0];

  return (
    <div className="calendar-container">
      <h2>📅 <strong>Satellit Kalender</strong></h2>
      
      {/* Calendar Component */}
      <CalendarComponent date={date} setDate={setDate} />

      {/* Event List */}
      <div className="event-list-container">
        <h3>🛰️ <strong>Begivenheder på {selectedDate}</strong></h3>
        <div className="event-list">
          {events.filter(event => event.date === selectedDate).length > 0 ? (
            events
              .filter(event => event.date === selectedDate)
              .map((event, index) => (
                <div key={index} className="event-item">
                  <strong>{event.satelliteName} - {event.time}</strong>
                  <p>{event.note}</p>
                </div>
              ))
          ) : (
            <p className="no-events">Ingen planlagte begivenheder denne dag.</p>
          )}
        </div>
      </div>

      {/* Button to Add Event */}
      <button className="add-event-button" onClick={() => navigate("/schedule")}>
        ➕ Tilføj Begivenhed
      </button>
    </div>
  );
};

export default CalendarPage;