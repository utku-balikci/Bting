import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CalendarComponent from "../Components/CalendarComponent";
import axios from "axios";
import { auth } from "../firebaseConfig"; // Ensure firebase is correctly configured
import "../Styles/CalendarPage.css";

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  // Fetch token and events when the page loads or when the date changes
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch the token
        const token = await auth.currentUser.getIdToken();

        // Format date to YYYY-MM-DD
        const formattedDate = new Date(date);
        formattedDate.setMinutes(formattedDate.getMinutes() - formattedDate.getTimezoneOffset());
        const selectedDate = formattedDate.toISOString().split("T")[0];

        // Fetch events from the backend
        const response = await axios.get(`http://localhost:3001/api/events/${selectedDate}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send the Firebase token in the request
          },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("❌ Failed to fetch events:", error.message);
      }
    };

    fetchEvents();
  }, [date]); // Re-fetch events when the date changes

  // Format the date correctly for display
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
          {events.length > 0 ? (
            events.map((event, index) => (
              <div key={index} className="event-item">
                <div className="event-title">
                  <strong>Event: </strong>{event.satelliteName}
                </div>
                <div className="event-time">
                  <strong>Time: </strong>{event.time}
                </div>
                <div className="event-note">
                  <strong>Note: </strong>{event.note}
                </div>
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