import React from "react";

const NoteItem = ({ note, onDelete }) => (
  <div className="bg-white p-4 rounded shadow-md flex flex-col justify-between">
    <div className="space-y-2">
      <p>
        <span className="font-bold">Title: </span>
        {note.title}
      </p>
      <p>
        <span className="font-bold">Content: </span>
        {note.content}
      </p>
      {note.tags.length > 0 && (
        <div className="flex gap-1">
          <span className="font-bold">Tags: </span>
          <div className="flex flex-col">
            {note.tags.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>

    <button
      onClick={onDelete}
      className="mt-4 self-end bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
    >
      Delete
    </button>
  </div>
);

export default NoteItem;
