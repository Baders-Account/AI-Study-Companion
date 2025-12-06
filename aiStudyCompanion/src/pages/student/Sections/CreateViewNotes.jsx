import React, { useMemo, useState, useEffect } from "react";
import { isValidUrl, buildNote, getCollapsedList } from "../studentComponents/utils";

import { API_BASE_URL } from "../../../config";

const URL = `${API_BASE_URL}/CreateViewnote`;

function CreateViewNotes({ courseName }) {
  const [notes, setNotes] = useState([]);
  const [noteName, setNoteName] = useState("");
  const [noteUrl, setNoteUrl] = useState("");
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [noteError, setNoteError] = useState("");

  // fetch the notes
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `${URL}?courseName=${encodeURIComponent(courseName)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setNotes(result);
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseName) {
      fetchNotes();
    }
  }, [courseName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNoteError("");
    setError("");

    if (!noteName.trim() || !noteUrl.trim()) {
      setNoteError("Both name and URL are required.");
      return;
    }

    if (!isValidUrl(noteUrl.trim())) {
      setNoteError("Please enter a valid URL (https://...).");
      return;
    }

    const baseNote = buildNote(noteName.trim(), noteUrl.trim());

    // extend it with courseName and createdAt
    const newNote = {
      ...baseNote,
      courseName,
      createdAt: new Date().toISOString(),
    };

    // optimistic update
    setNotes((prev) => [newNote, ...prev]);
    setNoteName("");
    setNoteUrl("");

    try {
      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create note");

    }
  };

  const handleDelete = async (id) => {
    setError("");
    const previous = notes;
    setNotes((prev) => prev.filter((n) => n.id !== id));

    try {
      const res = await fetch(`${URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete note");
      setNotes(previous);
    }
  };

  const visibleNotes = useMemo(
    () => getCollapsedList(notes, showAllNotes,3),
    [notes, showAllNotes]
  );

  return (
    <div className="flex flex-col rounded-2xl border shadow-lg p-5 bg-white dark:bg-gray-800">
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Create Note & View Notes
        </h2>
        <p className="text-sm text-gray-500">
          Add a note (name + link) for {courseName}.
        </p>
      </header>

      {error && (
        <p className="mb-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Note title"
          value={noteName}
          onChange={(e) => setNoteName(e.target.value)}
          className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 p-2"
        />
        <input
          type="url"
          placeholder="https://link-to-your-note"
          value={noteUrl}
          onChange={(e) => setNoteUrl(e.target.value)}
          className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 p-2"
        />
        {noteError && <p className="text-sm text-red-600">{noteError}</p>}
        <button
          type="submit"
          className="w-full text-white bg-gray-700 hover:bg-red-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Create Note
        </button>
      </form>

      {loading && notes.length === 0 && (
        <p className="text-sm text-gray-500">Loading notes...</p>
      )}

      <ul className="flex-1 space-y-2 overflow-auto pr-1">
        {visibleNotes.map((n) => (
          <li
            key={n.id}
            className="rounded-lg border p-3 flex justify-between items-start gap-2"
          >
            <a
              href={n.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline break-all"
            >
              {n.name}
            </a>
            <button
              type="button"
              onClick={() => handleDelete(n.id)}
              className="text-xs text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}

        {!loading && visibleNotes.length === 0 && (
          <li className="text-sm text-gray-500">
            No notes yet for this course.
          </li>
        )}
      </ul>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowAllNotes((s) => !s)}
          className="w-full text-white bg-gray-700 hover:bg-red-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          {showAllNotes ? "Show first 3" : "View all notes"}
        </button>
      </div>
    </div>
  );
}

export default CreateViewNotes;