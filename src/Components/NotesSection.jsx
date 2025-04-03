import { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import "../Styles/NotesSection.css";

const NotesSection = () => {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  const fetchNotes = async (user) => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get("http://localhost:3001/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📥 Notes fetched:", res.data);
      setNotes(res.data);
    } catch (err) {
      console.error("❌ Failed to load notes:", err.message);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete(`http://localhost:3001/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete note:", err.message);
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.post(
        "http://localhost:3001/api/notes",
        { text: note },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setNotes([res.data, ...notes]);
      setNote("");
    } catch (err) {
      console.error("❌ Failed to save note:", err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchNotes(user);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="notes-container">
      <h2 className="notes-title">Notes for Overpass</h2>

      <textarea
        className="notes-input"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Enter your notes here..."
      ></textarea>

      <button className="notes-submit" onClick={handleAddNote}>
        Add Note
      </button>

      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="no-entries">No notes yet.</p>
        ) : (
          notes.map((n) => (
            <div key={n._id} className="note-item">
              <div className="note-content">
                <p>{n.text}</p>
                <small>{new Date(n.createdAt).toLocaleString()}</small>
              </div>
              <button className="note-delete" onClick={() => handleDeleteNote(n._id)}>x</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesSection;