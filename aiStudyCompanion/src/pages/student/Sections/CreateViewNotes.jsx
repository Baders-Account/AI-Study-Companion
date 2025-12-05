import React, { useMemo, useState, useEffect } from "react";
import {
  isValidUrl,
  buildNote,
  getCollapsedList,
} from "../studentComponents/utils";

const URL = "https://backend-phi-topaz.vercel.app/api/notes";

function CreateViewNotes({ courseName }) {
  const [notes, setNotes] = useState([]);
  const [noteName, setNoteName] = useState("");
  const [noteUrl, setNoteUrl] = useState("");
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [noteError, setNoteError] = useState("");

  // Fetch notes when courseName changes
  useEffect(() => {
    if (!courseName) return;

    const controller = new AbortController();

    async function fetchNotes() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${URL}?courseName=${encodeURIComponent(courseName)}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch notes (status ${res.status})`);
        }

        const data = await res.json();
        setNotes(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
        setError(err.message || "Failed to fetch notes");
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();

    return () => controller.abort();
  }, [courseName]);

  const visibleNotes = useMemo(
    () => getCollapsedList(notes, showAllNotes, 3),
    [notes, showAllNotes]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setNoteError("");
    setError("");

    const trimmedName = noteName.trim();
    const trimmedUrl = noteUrl.trim();

    if (!trimmedName || !trimmedUrl) {
      setNoteError("Please fill in both fields.");
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setNoteError("Please enter a valid URL.");
      return;
    }

    const baseNote = buildNote(trimmedName, trimmedUrl);

    const newNote = {
      ...baseNote,
      courseName,
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI update
    setNotes((prev) => [newNote, ...prev]);
    setSaving(true);

    try {
      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });

      if (!res.ok) {
        throw new Error(`Failed to create note (status ${res.status})`);
      }

      const saved = await res.json();

      // Optionally sync with server version (_id instead of local id)
      setNotes((prev) => [
        saved,
        ...prev.filter((n) => n.id !== newNote.id),
      ]);

      setNoteName("");
      setNoteUrl("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create note");

      // Revert optimistic update on failure
      setNotes((prev) => prev.filter((n) => n.id !== newNote.id));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
      <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Notes
      </h2>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={noteName}
          onChange={(e) => setNoteName(e.target.value)}
          placeholder="Note title"
          className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="url"
          value={noteUrl}
          onChange={(e) => setNoteUrl(e.target.value)}
          placeholder="Note URL"
          className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:text-white"
        />

        {noteError && (
          <p className="text-xs text-red-600 dark:text-red-400">
            {noteError}
          </p>
        )}
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded hover:bg-gray-900 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Add note"}
        </button>
      </form>

      <div className="mt-4">
        {loading && notes.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading notes...
          </p>
        )}

        {!loading && notes.length === 0 && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No notes yet for this course.
          </p>
        )}

        <ul className="mt-2 space-y-1">
          {visibleNotes.map((note) => (
            <li key={note._id || note.id} className="text-sm">
              <a
                href={note.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {note.name}
              </a>
            </li>
          ))}
        </ul>

        {notes.length > 3 && (
          <button
            type="button"
            onClick={() => setShowAllNotes((s) => !s)}
            className="w-full mt-3 text-sm text-white bg-gray-700 rounded py-2 hover:bg-gray-900"
          >
            {showAllNotes ? "Show first 3" : "View all notes"}
          </button>
        )}
      </div>
    </div>
  );
}

export default CreateViewNotes;
