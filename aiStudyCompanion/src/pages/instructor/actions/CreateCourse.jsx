import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config";
import { useAuth } from "../../../contexts/AuthContext";

function CreateCourse() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Form state matching the new course schema
    const [form, setForm] = useState({
        courseName: "",
        courseCode: "",
        description: "",
        semester: "251", // Default to 2025 semester 1
        status: "active",
        syllabus: "",
        tags: "",
        startDate: "",
        endDate: "",
    });

    // Generate semester options from 2010 to 2025
    // Format: YYS where YY = last 2 digits of year, S = semester (1, 2, or 3)
    const generateSemesters = () => {
        const semesters = [];
        for (let year = 2025; year >= 2010; year--) {
            const yy = year.toString().slice(-2); // Get last 2 digits
            for (let sem = 1; sem <= 3; sem++) {
                semesters.push(`${yy}${sem}`);
            }
        }
        return semesters;
    };

    const semesters = generateSemesters();

    // Status options
    const statuses = [
        { value: "active", label: "Active" },
        { value: "draft", label: "Draft" },
        { value: "archived", label: "Archived" },
    ];

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        // Clear error when user starts typing
        if (error) setError(null);
    }

    // Validate courseCode format (2-4 letters + 3 digits, e.g., CS101)
    function isValidCourseCode(code) {
        const pattern = /^[A-Za-z]{2,4}\d{3}$/;
        return pattern.test(code);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Client-side validation
        if (!form.courseName.trim()) {
            setError("Course name is required.");
            setLoading(false);
            return;
        }

        if (!form.courseCode.trim()) {
            setError("Course code is required.");
            setLoading(false);
            return;
        }

        if (!isValidCourseCode(form.courseCode.trim())) {
            setError("Course code must be 2-4 letters followed by 3 digits (e.g., CS101, ICS104).");
            setLoading(false);
            return;
        }

        try {
            // Build the request body
            const requestBody = {
                courseName: form.courseName.trim(),
                courseCode: form.courseCode.trim().toUpperCase(),
                description: form.description.trim(),
                semester: form.semester,
                status: form.status,
                syllabus: form.syllabus.trim(),
                tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(t => t) : [],
                instructorId: user?._id || null,
                instructorName: user ? `${user.firstName} ${user.lastName}` : "",
            };

            // Add dates if provided
            if (form.startDate) {
                requestBody.startDate = new Date(form.startDate).toISOString();
            }
            if (form.endDate) {
                requestBody.endDate = new Date(form.endDate).toISOString();
            }

            const response = await fetch(`${API_BASE_URL}/courses`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle specific error codes
                if (response.status === 400) {
                    throw new Error(data.error || "Invalid course data. Please check your inputs.");
                } else if (response.status === 409) {
                    throw new Error(data.error || "A course with this code already exists.");
                } else {
                    throw new Error(data.error || `Error creating course: ${response.status}`);
                }
            }

            // Success!
            setSuccess(true);

            // Navigate after a brief delay to show success message
            setTimeout(() => {
                navigate("/instructor");
            }, 1500);

        } catch (err) {
            if (err.name === "TypeError" && err.message.includes("fetch")) {
                setError("Network error. Please check your connection and try again.");
            } else {
                setError(err.message || "An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="max-w-2xl mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create Course</h1>

            {/* Success message */}
            {success && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-green-600 dark:text-green-400 font-medium">
                        ✓ Course created successfully!
                    </p>
                    <p className="text-green-500 dark:text-green-500 text-sm mt-1">
                        Redirecting to dashboard...
                    </p>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 font-medium">Error: {error}</p>
                    <p className="text-red-500 dark:text-red-500 text-sm mt-1">
                        Please check your inputs and try again.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Course Name (Required) */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Course Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="courseName"
                        value={form.courseName}
                        onChange={handleChange}
                        className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., Introduction to Computer Science"
                        required
                        disabled={loading}
                    />
                </div>

                {/* Course Code (Required) */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Course Code <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="courseCode"
                        value={form.courseCode}
                        onChange={handleChange}
                        className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white uppercase"
                        placeholder="e.g., CS101 or ICS104"
                        required
                        disabled={loading}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Format: 2-4 letters + 3 digits (e.g., CS101, ICS104, MATH201)
                    </p>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 h-24 dark:bg-gray-700 dark:text-white"
                        placeholder="Brief description of the course content and objectives"
                        disabled={loading}
                    />
                </div>

                {/* Semester and Status - Side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Semester
                        </label>
                        <select
                            name="semester"
                            value={form.semester}
                            onChange={handleChange}
                            className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                            disabled={loading}
                        >
                            {semesters.map(sem => (
                                <option key={sem} value={sem}>{sem}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Status
                        </label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                            disabled={loading}
                        >
                            {statuses.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Start Date and End Date - Side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Start Date
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            End Date
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={form.endDate}
                            onChange={handleChange}
                            className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Tags
                    </label>
                    <input
                        name="tags"
                        value={form.tags}
                        onChange={handleChange}
                        className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., programming, beginner, computer science"
                        disabled={loading}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Separate multiple tags with commas
                    </p>
                </div>

                {/* Syllabus */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Syllabus (URL or Text)
                    </label>
                    <textarea
                        name="syllabus"
                        value={form.syllabus}
                        onChange={handleChange}
                        className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 h-20 dark:bg-gray-700 dark:text-white"
                        placeholder="Link to syllabus document or brief syllabus text"
                        disabled={loading}
                    />
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={loading || success}
                        className="px-5 py-2.5 rounded-lg bg-gray-700 text-white hover:bg-red-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating..." : success ? "Created!" : "Create Course"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-5 py-2.5 rounded-lg border dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </main>
    );
}

export default CreateCourse;
