import { useState } from "react";
import "../Styles/NotesSection.css"; 

const NotesSection = () => {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleAddNote = () => {
    if (note.trim() !== "") {
      setNotes([...notes, note]); 
      setNote(""); 
    }
  };

  return (
    <div className="notes-container">
      <h2 className="notes-title">Notes for Overpass:</h2>
      <textarea
        className="notes-input"
        value={note}
        onChange={handleNoteChange}
        placeholder="Enter notes..."
      ></textarea>
      <button className="notes-submit" onClick={handleAddNote}>Add Note</button>
      
      <div className="notes-list">
        {notes.map((note, index) => (
          <div key={index} className="note-item">{note}</div>
        ))}
      </div>
    </div>
  );
};

export default NotesSection;