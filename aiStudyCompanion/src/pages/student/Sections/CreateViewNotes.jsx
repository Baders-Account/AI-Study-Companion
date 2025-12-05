import React, { useMemo, useState } from "react";
import { isValidUrl, buildNote, getCollapsedList } from "../studentComponents/utils";

 function CreateViewNotes() {
  const [notes, setNotes] = useState([
    buildNote("Intro to React – Cheatsheet", "https://react.dev/learn"),
    buildNote("Tailwind Quick Ref", "https://tailwindcss.com/docs"),
    buildNote(
      "JS Array Methods",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"
    ),
    buildNote("Git Basics", "https://git-scm.com/docs"),
  ]);
  const [noteName, setNoteName] = useState("");
  const [noteUrl, setNoteUrl] = useState("");
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [noteError, setNoteError] = useState("");

  const visibleNotes = useMemo(
    () => getCollapsedList(notes, showAllNotes, 3),
    [notes, showAllNotes]
  );

  function handleAddNote(e) {
    e.preventDefault();
    setNoteError("");
    if (!noteName.trim() || !noteUrl.trim()) {
      setNoteError("Both fields are required.");
      return;
    }
    if (!isValidUrl(noteUrl)) {
      setNoteError("Please enter a valid URL (e.g., https://example.com).");
      return;
    }
    setNotes((prev) => [buildNote(noteName.trim(), noteUrl.trim()), ...prev]);
    setNoteName("");
    setNoteUrl("");
  }

  return (
    <article className="flex flex-col rounded-2xl border shadow-lg p-5 bg-white dark:bg-gray-800">
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Create Note & View Notes
        </h2>
        <p className="text-sm text-gray-500">
          Add a note (name + link).
        </p>
      </header>

      <form onSubmit={handleAddNote} className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Note name"
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
          className="w-full text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Create Note
        </button>
      </form>

      <ul className="flex-1 space-y-2 overflow-auto pr-1">
        {visibleNotes.map((n) => (
          <li key={n.id} className="rounded-lg border p-3">
            <a
              href={n.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline break-all"
            >
              {n.name}
            </a>
          </li>
        ))}
        {visibleNotes.length === 0 && (
          <li className="text-sm text-gray-500">
            No notes yet. Add your first above.
          </li>
        )}
      </ul>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowAllNotes((s) => !s)}
          className="w-full text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          {showAllNotes ? "Show first 3" : "View all notes"}
        </button>
      </div>
    </article>
  );
}export default CreateViewNotes
