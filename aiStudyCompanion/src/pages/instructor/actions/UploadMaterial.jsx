import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config";
import { useAuth } from "../../../contexts/AuthContext";

export default function UploadMaterial() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    // Form state matching the materials schema
    const [form, setForm] = useState({
        courseId: "",
        title: "",
        description: "",
        type: "document",
        topic: "",
        isPublished: true,
        // For URL-based materials
        fileUrl: "",
        // For file uploads
        selectedFile: null,
    });

    // Material type options
    const materialTypes = [
        { value: "pdf", label: "PDF Document" },
        { value: "video", label: "Video" },
        { value: "link", label: "External Link" },
        { value: "document", label: "Document" },
        { value: "slides", label: "Slides/Presentation" },
    ];

    // Fetch instructor's courses on mount
    useEffect(() => {
        async function fetchCourses() {
            try {
                const url = user?._id
                    ? `${API_BASE_URL}/courses?instructorId=${user._id}`
                    : `${API_BASE_URL}/courses`;
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data);
                }
            } catch (err) {
                console.error("Failed to fetch courses:", err);
            } finally {
                setLoadingCourses(false);
            }
        }
        fetchCourses();
    }, [user]);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({
            ...f,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (error) setError(null);
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            // Check file size (16MB limit for MongoDB)
            if (file.size > 16 * 1024 * 1024) {
                setError("File too large. Maximum size is 16MB. Use a URL link for larger files.");
                return;
            }
            setForm((f) => ({
                ...f,
                selectedFile: file,
            }));
            if (error) setError(null);
        }
    }

    // Convert file to base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remove the data:*/*;base64, prefix
                const base64 = reader.result.split(",")[1];
                resolve(base64);
            };
            reader.onerror = (error) => reject(error);
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Client-side validation
        if (!form.courseId) {
            setError("Please select a course.");
            setLoading(false);
            return;
        }

        if (!form.title.trim()) {
            setError("Title is required.");
            setLoading(false);
            return;
        }

        if (!form.type) {
            setError("Please select a material type.");
            setLoading(false);
            return;
        }

        // For links and videos, URL is required
        if ((form.type === "link" || form.type === "video") && !form.fileUrl.trim()) {
            setError("Please provide a URL for this material type.");
            setLoading(false);
            return;
        }

        // For documents/PDFs/slides, either file or URL is needed
        if (["pdf", "document", "slides"].includes(form.type) && !form.selectedFile && !form.fileUrl.trim()) {
            setError("Please upload a file or provide a URL.");
            setLoading(false);
            return;
        }

        try {
            // Build the request body
            const requestBody = {
                courseId: form.courseId,
                instructorId: user?._id,
                title: form.title.trim(),
                description: form.description.trim(),
                type: form.type,
                topic: form.topic.trim(),
                isPublished: form.isPublished,
                fileUrl: form.fileUrl.trim(),
            };

            // If a file was selected, convert to base64
            if (form.selectedFile) {
                const base64Content = await fileToBase64(form.selectedFile);
                requestBody.fileContent = base64Content;
                requestBody.fileName = form.selectedFile.name;
                requestBody.fileSize = form.selectedFile.size;
                requestBody.mimeType = form.selectedFile.type;
            }

            const response = await fetch(`${API_BASE_URL}/materials`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error(data.error || "Invalid material data. Please check your inputs.");
                } else if (response.status === 403) {
                    throw new Error(data.error || "You don't have permission to upload materials.");
                } else if (response.status === 404) {
                    throw new Error(data.error || "Course or instructor not found.");
                } else {
                    throw new Error(data.error || `Error uploading material: ${response.status}`);
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
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Upload Material</h1>

            {/* Success message */}
            {success && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-green-600 dark:text-green-400 font-medium">
                        Material uploaded successfully!
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
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Course Selection (Required) */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Course <span className="text-red-500">*</span>
                    </label>
                    {loadingCourses ? (
                        <div className="text-gray-500 dark:text-gray-400">Loading courses...</div>
                    ) : courses.length === 0 ? (
                        <div className="text-amber-600 dark:text-amber-400">
                            No courses found. Please create a course first.
                        </div>
                    ) : (
                        <select
                            name="courseId"
                            value={form.courseId}
                            onChange={handleChange}
                            className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                            required
                            disabled={loading}
                        >
                            <option value="">-- Select a course --</option>
                            {courses.map((course) => (
                                <option key={course._id} value={course._id}>
                                    {course.courseCode} - {course.courseName}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Title (Required) */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., Week 1: Introduction to Variables"
                        required
                        disabled={loading}
                    />
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
                        className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 h-20 dark:bg-gray-700 dark:text-white"
                        placeholder="Brief description of this material"
                        disabled={loading}
                    />
                </div>

                {/* Type and Topic - Side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                            required
                            disabled={loading}
                        >
                            {materialTypes.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Topic
                        </label>
                        <input
                            name="topic"
                            value={form.topic}
                            onChange={handleChange}
                            className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                            placeholder="e.g., Variables and Data Types"
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* URL Input */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        URL / Link
                        {(form.type === "link" || form.type === "video") && (
                            <span className="text-red-500"> *</span>
                        )}
                    </label>
                    <input
                        type="url"
                        name="fileUrl"
                        value={form.fileUrl}
                        onChange={handleChange}
                        className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                        placeholder="https://..."
                        disabled={loading}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {form.type === "video"
                            ? "YouTube, Vimeo, or direct video URL"
                            : form.type === "link"
                            ? "External website URL"
                            : "Direct link to the file (or upload below)"}
                    </p>
                </div>

                {/* File Upload - Only for pdf, document, slides */}
                {["pdf", "document", "slides"].includes(form.type) && (
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Upload File
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-gray-100 dark:file:bg-gray-600 file:text-gray-700 dark:file:text-gray-200"
                            accept={
                                form.type === "pdf"
                                    ? ".pdf"
                                    : form.type === "slides"
                                    ? ".ppt,.pptx,.pdf"
                                    : ".doc,.docx,.pdf,.txt"
                            }
                            disabled={loading}
                        />
                        {form.selectedFile && (
                            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                                Selected: {form.selectedFile.name} ({(form.selectedFile.size / 1024).toFixed(1)} KB)
                            </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Maximum file size: 16MB. For larger files, use a URL link instead.
                        </p>
                    </div>
                )}

                {/* Published Toggle */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="isPublished"
                        name="isPublished"
                        checked={form.isPublished}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                        disabled={loading}
                    />
                    <label htmlFor="isPublished" className="text-sm text-gray-700 dark:text-gray-300">
                        Publish immediately (visible to students)
                    </label>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={loading || success || courses.length === 0}
                        className="px-5 py-2.5 rounded-lg bg-gray-700 text-white hover:bg-red-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? "Uploading..." : success ? "Uploaded!" : "Upload Material"}
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
