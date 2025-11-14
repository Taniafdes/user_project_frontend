import React, { useEffect, useState } from "react";
import { getNotes, createNote, deleteNote } from "../api/api";
import NoteItem from "../components/NoteItem";
import { useNavigate } from "react-router-dom";

const Notes = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // Helper: sanitize note to ensure required fields are present
  // Removed dangerous fallback key generation. Server must provide _id.
  const sanitizeNote = (note) => ({
    _id: note._id,
    title: note.title ?? "",
    content: note.content ?? "",
    tags: Array.isArray(note.tags) ? note.tags : [],
  });

  // Fetch notes from backend
  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchNotes = async () => {
      try {
        const notesArray = await getNotes(token, filterTag);
        setNotes(Array.isArray(notesArray) ? notesArray.map(sanitizeNote) : []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch notes.");
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [token, filterTag, navigate]);

  // Add a new note
  const handleAddNote = async (e) => {
  e.preventDefault();
  if (!title.trim()) {
    setError("Title is required.");
    return;
  }

  try {
    const newNoteResponse = await createNote(token, {
      title,
      content,
      tags: tag
        ? tag.split(",").map(t => t.trim()).filter(Boolean) // ✅ convert comma-separated string to array
        : [],
    });

    const createdNote = newNoteResponse.note;
    if (!createdNote || !createdNote._id) throw new Error("Invalid note from server");

    setNotes(prev => [sanitizeNote(createdNote), ...prev]);
    setTitle("");
    setContent("");
    setTag(""); // reset input
    setError("");
  } catch (err) {
    console.error(err);
    setError("Failed to add note: " + (err.message || "Unknown error."));
  }
};


  // Delete a note
  const handleDelete = async (id) => {
    if (!id) {
        console.error("Attempted to delete note without an ID.");
        setError("Cannot delete note: ID is missing.");
        return;
    }
    
    // *** IMPROVEMENT: Optimistic UI Update ***
    // 1. Save the current state in case of failure
    const originalNotes = notes;
    // 2. Remove the note immediately from state for fast user feedback
    setNotes(notes.filter((n) => n._id !== id));
    
    try {
      await deleteNote(token, id);
      // Success: State is already updated
    } catch (err) {
      console.error(err);
      setError("Failed to delete note. Restoring notes list.");
      // Revert the state to the original list on failure
      setNotes(originalNotes); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Filter notes by search
  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  // Collect unique tags
  const allTags = [...new Set(notes.flatMap((n) => n.tags))];

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Notes</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Add Note Form */}
      <form onSubmit={handleAddNote} className="bg-white p-6 rounded shadow-md mb-6 space-y-4">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          placeholder="Tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add Note
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Search + Tag Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          placeholder="Search by title/content"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">No notes found</p>
        ) : (
          filteredNotes.map((note) => (
            <NoteItem
              key={note._id}
              note={note}
              onDelete={() => handleDelete(note._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Notes;