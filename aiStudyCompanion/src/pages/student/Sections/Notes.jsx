import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../../config";
import { useAuth } from "../../../contexts/AuthContext";

// Available note colors for visual organization
const NOTE_COLORS = [
    { value: "#FFE5B4", label: "Peach", className: "bg-orange-100" },
    { value: "#B4E5FF", label: "Sky Blue", className: "bg-blue-100" },
    { value: "#B4FFB4", label: "Mint", className: "bg-green-100" },
    { value: "#FFB4D9", label: "Pink", className: "bg-pink-100" },
    { value: "#E5B4FF", label: "Lavender", className: "bg-purple-100" },
    { value: "#FFFFB4", label: "Yellow", className: "bg-yellow-100" },
    { value: "#FFFFFF", label: "White", className: "bg-white" },
];

function Notes() {
    const { user, isAuthenticated } = useAuth();
    const [notes, setNotes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Filters
    const [selectedCourse, setSelectedCourse] = useState("all");
    const [showAll, setShowAll] = useState(false);
    const [showPinnedOnly, setShowPinnedOnly] = useState(false);

    // Create note form state
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newNote, setNewNote] = useState({
        title: "",
        content: "",
        courseId: "",
        color: "#FFFFFF",
        tags: "",
        isPinned: false,
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    // Edit note state
    const [editingNote, setEditingNote] = useState(null);
    const [editForm, setEditForm] = useState({});

    const limit = 6;

    // Fetch enrolled courses
    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const fetchCourses = async () => {
            try {
                // Fetch enrollments to get enrolled course IDs
                const enrollRes = await fetch(`${API_BASE_URL}/enrollments?studentId=${user._id}&status=active`);
                if (enrollRes.ok) {
                    const enrollments = await enrollRes.json();
                    const courseIds = enrollments.map(e => e.courseId);
                    setEnrolledCourseIds(courseIds);

                    // Fetch course details for enrolled courses
                    if (courseIds.length > 0) {
                        const coursesRes = await fetch(`${API_BASE_URL}/courses`);
                        if (coursesRes.ok) {
                            const allCourses = await coursesRes.json();
                            const enrolled = allCourses.filter(c =>
                                courseIds.includes(c._id) || courseIds.includes(c.id?.toString())
                            );
                            setCourses(enrolled);
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        fetchCourses();
    }, [isAuthenticated, user]);

    // Fetch notes
    const fetchNotes = async () => {
        if (!isAuthenticated || !user) return;

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/notes?studentId=${user._id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setNotes(result);
        } catch (err) {
            console.error("Error fetching notes:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [isAuthenticated, user]);

    // Filter notes by course and pinned status
    const filteredNotes = useMemo(() => {
        let filtered = notes;

        // Filter by course
        if (selectedCourse !== "all") {
            filtered = filtered.filter(n => n.courseId === selectedCourse);
        }

        // Filter by pinned status
        if (showPinnedOnly) {
            filtered = filtered.filter(n => n.isPinned);
        }

        return filtered;
    }, [notes, selectedCourse, showPinnedOnly]);

    // Show limited or all notes
    const visibleNotes = useMemo(() => {
        if (showAll) return filteredNotes;
        return filteredNotes.slice(0, limit);
    }, [filteredNotes, showAll]);

    // Get course name by ID
    const getCourseName = (courseId) => {
        if (!courseId) return "No Course";
        const course = courses.find(c => c._id === courseId || c.id === courseId);
        return course ? `${course.courseCode} - ${course.courseName}` : "Unknown Course";
    };

    // Get color style
    const getColorStyle = (color) => {
        return { backgroundColor: color || "#FFFFFF" };
    };

    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Create note
    const handleCreateNote = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);

        if (!newNote.title.trim()) {
            setFormError("Title is required.");
            setFormLoading(false);
            return;
        }

        try {
            const requestBody = {
                studentId: user._id,
                title: newNote.title.trim(),
                content: newNote.content.trim(),
                courseId: newNote.courseId || null,
                color: newNote.color,
                tags: newNote.tags.split(",").map(t => t.trim()).filter(t => t),
                isPinned: newNote.isPinned,
                isShared: false,
            };

            const response = await fetch(`${API_BASE_URL}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            // Reset form and refresh notes
            setNewNote({
                title: "",
                content: "",
                courseId: "",
                color: "#FFFFFF",
                tags: "",
                isPinned: false,
            });
            setShowCreateForm(false);
            setSuccess("Note created successfully!");
            setTimeout(() => setSuccess(null), 3000);
            fetchNotes();
        } catch (err) {
            console.error("Error creating note:", err);
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    // Start editing a note
    const startEdit = (note) => {
        setEditingNote(note._id);
        setEditForm({
            title: note.title,
            content: note.content || "",
            courseId: note.courseId || "",
            color: note.color || "#FFFFFF",
            tags: (note.tags || []).join(", "),
            isPinned: note.isPinned || false,
        });
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingNote(null);
        setEditForm({});
    };

    // Save edited note
    const saveEdit = async (noteId) => {
        setFormLoading(true);
        setFormError(null);

        if (!editForm.title.trim()) {
            setFormError("Title is required.");
            setFormLoading(false);
            return;
        }

        try {
            const requestBody = {
                title: editForm.title.trim(),
                content: editForm.content.trim(),
                courseId: editForm.courseId || null,
                color: editForm.color,
                tags: editForm.tags.split(",").map(t => t.trim()).filter(t => t),
                isPinned: editForm.isPinned,
            };

            const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            setEditingNote(null);
            setEditForm({});
            setSuccess("Note updated successfully!");
            setTimeout(() => setSuccess(null), 3000);
            fetchNotes();
        } catch (err) {
            console.error("Error updating note:", err);
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    // Delete note
    const deleteNote = async (noteId) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;

        try {
            const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setSuccess("Note deleted successfully!");
            setTimeout(() => setSuccess(null), 3000);
            fetchNotes();
        } catch (err) {
            console.error("Error deleting note:", err);
            setError(err.message);
        }
    };

    // Toggle pin status
    const togglePin = async (note) => {
        try {
            const response = await fetch(`${API_BASE_URL}/notes/${note._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPinned: !note.isPinned }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            fetchNotes();
        } catch (err) {
            console.error("Error toggling pin:", err);
            setError(err.message);
        }
    };

    if (!isAuthenticated) {
        return (
            <section className="p-6 mt-16 w-full min-h-screen bg-white dark:bg-gray-900">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📝 Notes</h1>
                    <Link to="/Dashboard" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                        ← Back to Dashboard
                    </Link>
                </div>
                <div className="flex flex-col rounded-2xl border shadow-lg p-5 bg-white dark:bg-gray-800">
                    <p className="text-gray-500 text-center">Please log in to view your notes.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="p-6 mt-16 w-full min-h-screen bg-white dark:bg-gray-900">
            {/* Page Header */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📝 Notes</h1>
                <Link to="/Dashboard" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                    ← Back to Dashboard
                </Link>
            </div>

            {/* Notes Card */}
            <div className="flex flex-col rounded-2xl border shadow-lg p-5 bg-white dark:bg-gray-800">
                <header className="mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                My Notes
                            </h2>
                            <p className="text-sm text-gray-500">
                                Create and organize your study notes.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                            {showCreateForm ? "Cancel" : "+ New Note"}
                        </button>
                    </div>
                </header>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                        Error: {error}
                    </div>
                )}

                {/* Create Note Form */}
                {showCreateForm && (
                    <form onSubmit={handleCreateNote} className="mb-6 p-4 border rounded-xl bg-gray-50 dark:bg-gray-700 space-y-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">Create New Note</h3>

                        <input
                            type="text"
                            placeholder="Note title *"
                            value={newNote.title}
                            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        <textarea
                            placeholder="Note content (supports Markdown)"
                            value={newNote.content}
                            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                            rows={4}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <select
                                value={newNote.courseId}
                                onChange={(e) => setNewNote({ ...newNote, courseId: e.target.value })}
                                className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">No Course</option>
                                {courses.map((course) => (
                                    <option key={course._id || course.id} value={course._id || course.id}>
                                        {course.courseCode} - {course.courseName}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={newNote.color}
                                onChange={(e) => setNewNote({ ...newNote, color: e.target.value })}
                                className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                            >
                                {NOTE_COLORS.map((color) => (
                                    <option key={color.value} value={color.value}>
                                        {color.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <input
                            type="text"
                            placeholder="Tags (comma-separated, e.g., 'exam, week1, important')"
                            value={newNote.tags}
                            onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />

                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                checked={newNote.isPinned}
                                onChange={(e) => setNewNote({ ...newNote, isPinned: e.target.checked })}
                                className="rounded"
                            />
                            Pin this note
                        </label>

                        {formError && <p className="text-red-600 text-sm">{formError}</p>}

                        <button
                            type="submit"
                            disabled={formLoading}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 disabled:opacity-50"
                        >
                            {formLoading ? "Creating..." : "Create Note"}
                        </button>
                    </form>
                )}

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-4">
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Courses</option>
                        {courses.map((course) => (
                            <option key={course._id || course.id} value={course._id || course.id}>
                                {course.courseCode} - {course.courseName}
                            </option>
                        ))}
                    </select>

                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                            type="checkbox"
                            checked={showPinnedOnly}
                            onChange={(e) => setShowPinnedOnly(e.target.checked)}
                            className="rounded"
                        />
                        Pinned only
                    </label>
                </div>

                {loading && <p className="text-gray-500 text-sm mb-2">Loading notes...</p>}

                {/* Notes Grid */}
                <div className="grid gap-4 md:grid-cols-2 max-h-[500px] overflow-y-auto pr-1">
                    {visibleNotes.map((note) => (
                        <div
                            key={note._id}
                            style={getColorStyle(note.color)}
                            className="rounded-xl border p-4 shadow-sm transition-all hover:shadow-md relative"
                        >
                            {/* Pin indicator */}
                            {note.isPinned && (
                                <span className="absolute top-2 right-2 text-lg" title="Pinned">📌</span>
                            )}

                            {editingNote === note._id ? (
                                /* Edit Form */
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                    />
                                    <textarea
                                        value={editForm.content}
                                        onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                        rows={3}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                    />
                                    <select
                                        value={editForm.courseId}
                                        onChange={(e) => setEditForm({ ...editForm, courseId: e.target.value })}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                    >
                                        <option value="">No Course</option>
                                        {courses.map((c) => (
                                            <option key={c._id || c.id} value={c._id || c.id}>
                                                {c.courseCode}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={editForm.color}
                                        onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                    >
                                        {NOTE_COLORS.map((c) => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        value={editForm.tags}
                                        onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                                        placeholder="Tags"
                                        className="w-full px-2 py-1 border rounded text-sm"
                                    />
                                    <label className="flex items-center gap-1 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={editForm.isPinned}
                                            onChange={(e) => setEditForm({ ...editForm, isPinned: e.target.checked })}
                                        />
                                        Pinned
                                    </label>
                                    {formError && <p className="text-red-600 text-xs">{formError}</p>}
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => saveEdit(note._id)}
                                            disabled={formLoading}
                                            className="flex-1 px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {formLoading ? "..." : "Save"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="flex-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Note Display */
                                <>
                                    <h3 className="font-semibold text-gray-900 mb-2 pr-6">
                                        {note.title}
                                    </h3>

                                    {note.content && (
                                        <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap line-clamp-4">
                                            {note.content}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {note.tags && note.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="text-xs text-gray-500 mb-3">
                                        <span>{getCourseName(note.courseId)}</span>
                                        {note.updatedAt && (
                                            <span className="ml-2">• {formatDate(note.updatedAt)}</span>
                                        )}
                                    </div>

                                    <div className="flex gap-2 pt-2 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => togglePin(note)}
                                            className="text-xs text-gray-600 hover:text-blue-600"
                                            title={note.isPinned ? "Unpin" : "Pin"}
                                        >
                                            {note.isPinned ? "📌 Unpin" : "📍 Pin"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => startEdit(note)}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteNote(note._id)}
                                            className="text-xs text-red-600 hover:text-red-800"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    {!loading && visibleNotes.length === 0 && (
                        <div className="col-span-2 text-sm text-gray-500 text-center py-8">
                            {filteredNotes.length === 0
                                ? "No notes yet. Click '+ New Note' to create your first note!"
                                : "No notes match the selected filters."
                            }
                        </div>
                    )}
                </div>

                {/* Show more/less button */}
                {filteredNotes.length > limit && (
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={() => setShowAll((s) => !s)}
                            className="w-full text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                        >
                            {showAll
                                ? `Show first ${limit}`
                                : `View all notes (${filteredNotes.length})`
                            }
                        </button>
                    </div>
                )}

                {/* Notes count */}
                <p className="text-xs text-gray-400 mt-3 text-center">
                    Showing {visibleNotes.length} of {filteredNotes.length} notes
                    {notes.length > 0 && ` (${notes.filter(n => n.isPinned).length} pinned)`}
                </p>
            </div>
        </section>
    );
}

export default Notes;
