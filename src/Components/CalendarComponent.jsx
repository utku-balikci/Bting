import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../Styles/CalendarComponent.css";

const CalendarComponent = ({ date, setDate }) => {
  const handleDateChange = (newDate) => {
    
    const adjustedDate = new Date(newDate);
    adjustedDate.setMinutes(adjustedDate.getMinutes() - adjustedDate.getTimezoneOffset());
    setDate(adjustedDate);
  };

  return (
    <div className="calendar-wrapper">
      <Calendar onChange={handleDateChange} value={date} />
    </div>
  );
};

export default CalendarComponent;