import React, { useState, useEffect, useMemo } from "react";
import { API_BASE_URL } from "../../../config";
import { useAuth } from "../../../contexts/AuthContext";

const MATERIAL_TYPES = [
    { value: "all", label: "All Types" },
    { value: "pdf", label: "PDF" },
    { value: "video", label: "Video" },
    { value: "link", label: "Link" },
    { value: "document", label: "Document" },
    { value: "slides", label: "Slides" }
];

function ViewMaterials() {
    const { user, isAuthenticated, isStudent, isInstructor } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [courses, setCourses] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Filters
    const [selectedType, setSelectedType] = useState("all");
    const [selectedCourse, setSelectedCourse] = useState("all");
    const [showAll, setShowAll] = useState(false);

    const limit = 5;

    // Fetch enrolled courses for students, or created courses for instructors
    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const fetchCourses = async () => {
            try {
                if (isStudent) {
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
                } else if (isInstructor) {
                    // Fetch instructor's courses
                    const coursesRes = await fetch(`${API_BASE_URL}/courses?instructorId=${user._id}`);
                    if (coursesRes.ok) {
                        const instructorCourses = await coursesRes.json();
                        setCourses(instructorCourses);
                        setEnrolledCourseIds(instructorCourses.map(c => c._id || c.id));
                    }
                }
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        fetchCourses();
    }, [isAuthenticated, user, isStudent, isInstructor]);

    // Fetch materials
    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const fetchMaterials = async () => {
            setLoading(true);
            setError(null);
            try {
                // Build query params
                const params = new URLSearchParams();

                // For students, only show published materials
                if (isStudent) {
                    params.append("isPublished", "true");
                }

                // For instructors, fetch their own materials
                if (isInstructor) {
                    params.append("instructorId", user._id);
                }

                const response = await fetch(`${API_BASE_URL}/materials?${params.toString()}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setMaterials(result);
            } catch (err) {
                console.error("Error fetching materials:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMaterials();
    }, [isAuthenticated, user, isStudent, isInstructor]);

    // Filter materials by type, course, and enrollment
    const filteredMaterials = useMemo(() => {
        let filtered = materials;

        // For students, only show materials from enrolled courses
        if (isStudent && enrolledCourseIds.length > 0) {
            filtered = filtered.filter(m =>
                enrolledCourseIds.includes(m.courseId)
            );
        }

        // Filter by type
        if (selectedType !== "all") {
            filtered = filtered.filter(m => m.type === selectedType);
        }

        // Filter by course
        if (selectedCourse !== "all") {
            filtered = filtered.filter(m => m.courseId === selectedCourse);
        }

        return filtered;
    }, [materials, selectedType, selectedCourse, enrolledCourseIds, isStudent]);

    // Show limited or all materials
    const visibleMaterials = useMemo(() => {
        if (showAll) return filteredMaterials;
        return filteredMaterials.slice(0, limit);
    }, [filteredMaterials, showAll]);

    // Get course name by ID
    const getCourseName = (courseId) => {
        const course = courses.find(c => c._id === courseId || c.id === courseId);
        return course ? `${course.courseCode} - ${course.courseName}` : "Unknown Course";
    };

    // Get type icon
    const getTypeIcon = (type) => {
        switch (type) {
            case "pdf": return "📄";
            case "video": return "🎬";
            case "link": return "🔗";
            case "document": return "📝";
            case "slides": return "📊";
            default: return "📁";
        }
    };

    // Handle view/download material
    const handleViewMaterial = (material) => {
        if (material.fileUrl) {
            // External URL - open in new tab
            window.open(material.fileUrl, "_blank", "noopener,noreferrer");
        } else if (material.fileContent) {
            // Base64 content - download file
            const link = document.createElement("a");
            link.href = `data:${material.mimeType || "application/octet-stream"};base64,${material.fileContent}`;
            link.download = material.fileName || `${material.title}.${material.type}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("No file available for this material.");
        }
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (!bytes) return "";
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col rounded-2xl border shadow-lg p-5 bg-white dark:bg-gray-800">
                <p className="text-gray-500 text-center">Please log in to view materials.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col rounded-2xl border shadow-lg p-5 bg-white dark:bg-gray-800">
            <header className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Course Materials
                </h2>
                <p className="text-sm text-gray-500">
                    {isStudent ? "View materials from your enrolled courses." : "View materials you've uploaded."}
                </p>
            </header>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
                {/* Type Filter */}
                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                    {MATERIAL_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>

                {/* Course Filter */}
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
            </div>

            {error && <p className="text-red-600 text-sm mb-2">Error: {error}</p>}
            {loading && <p className="text-gray-500 text-sm mb-2">Loading materials...</p>}

            {/* Materials List */}
            <ul className="flex-1 space-y-3 overflow-auto pr-1 max-h-96">
                {visibleMaterials.map((material) => (
                    <li
                        key={material._id}
                        className="rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{getTypeIcon(material.type)}</span>
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        {material.title}
                                    </h3>
                                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-full capitalize">
                                        {material.type}
                                    </span>
                                </div>

                                {material.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {material.description}
                                    </p>
                                )}

                                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                                    <span>Course: {getCourseName(material.courseId)}</span>
                                    {material.topic && <span>Topic: {material.topic}</span>}
                                    {material.fileSize && <span>Size: {formatFileSize(material.fileSize)}</span>}
                                    {material.uploadedAt && <span>Uploaded: {formatDate(material.uploadedAt)}</span>}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleViewMaterial(material)}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                                {material.type === "link" || material.type === "video" ? "Open" : "Download"}
                            </button>
                        </div>
                    </li>
                ))}

                {!loading && visibleMaterials.length === 0 && (
                    <li className="text-sm text-gray-500 text-center py-8">
                        {filteredMaterials.length === 0
                            ? (isStudent
                                ? "No materials available for your enrolled courses."
                                : "No materials uploaded yet.")
                            : "No materials match the selected filters."
                        }
                    </li>
                )}
            </ul>

            {/* Show more/less button */}
            {filteredMaterials.length > limit && (
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={() => setShowAll((s) => !s)}
                        className="w-full text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                    >
                        {showAll
                            ? `Show first ${limit}`
                            : `View all materials (${filteredMaterials.length})`
                        }
                    </button>
                </div>
            )}

            {/* Materials count */}
            <p className="text-xs text-gray-400 mt-3 text-center">
                Showing {visibleMaterials.length} of {filteredMaterials.length} materials
            </p>
        </div>
    );
}

export default ViewMaterials;
