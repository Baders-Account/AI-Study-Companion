import { useEffect, useState, useContext } from "react"
import { NavLink, useNavigate } from "react-router-dom";
import React from 'react';
import { CoursesContext } from './CourseContext'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShowContext } from "../../../App";
import { API_BASE_URL } from "../../../config";
import { useAuth } from "../../../contexts/AuthContext";

function Courses() {
    const shared = useContext(CoursesContext); // all courses are here
    const limit = 3; // limit courses displayed
    const [inputValue, setInputValue] = useState("");
    const { setShowAllCourses } = useContext(ShowContext);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user, isStudent, isInstructor } = useAuth();
    const navigate = useNavigate();

    // Displayed courses (different logic for students vs instructors)
    const [displayedCourses, setDisplayedCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);

    // Fetch courses based on user role
    const fetchCourses = async () => {
        if (!user?._id) return;

        try {
            if (isStudent) {
                // Students: Fetch enrollments and filter to enrolled courses
                const response = await fetch(
                    `${API_BASE_URL}/enrollments?studentId=${user._id}&status=active`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setEnrollments(data);

                // Get enrolled course IDs
                const enrolledCourseIds = data.map(e => e.courseId);

                // Filter courses to only show enrolled ones
                if (shared.courses && shared.courses.length > 0) {
                    const enrolled = shared.courses.filter(course =>
                        enrolledCourseIds.includes(course._id)
                    );
                    setDisplayedCourses(enrolled);
                }
            } else if (isInstructor) {
                // Instructors: Fetch courses they created
                const response = await fetch(
                    `${API_BASE_URL}/courses?instructorId=${user._id}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setDisplayedCourses(data);
            }
        } catch (err) {
            console.error("Error fetching courses:", err);
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [user?._id, shared.courses, isStudent, isInstructor]);

    // Unenroll from a course (students only)
    const unenrollFromCourse = async (courseId) => {
        if (!user?._id || !isStudent) return;

        setIsLoading(true);
        setError('');

        try {
            // Find the enrollment for this course
            const enrollment = enrollments.find(e => e.courseId === courseId);
            if (!enrollment) {
                throw new Error("Enrollment not found");
            }

            const response = await fetch(`${API_BASE_URL}/enrollments/${enrollment._id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            toast.success("Unenrolled from course!", { autoClose: 2000 });

            // Refresh courses
            fetchCourses();
        } catch (err) {
            console.error(err);
            setError(err.message);
            toast.error("Failed to unenroll", { autoClose: 3000 });
        } finally {
            setIsLoading(false);
        }
    };

    // Delete a course (instructors only)
    const deleteCourse = async (courseId) => {
        if (!user?._id || !isInstructor) return;

        if (!window.confirm("Are you sure you want to delete this course?")) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            toast.success("Course deleted!", { autoClose: 2000 });

            // Refresh courses
            fetchCourses();
        } catch (err) {
            console.error(err);
            setError(err.message);
            toast.error("Failed to delete course", { autoClose: 3000 });
        } finally {
            setIsLoading(false);
        }
    };

    // Get header text based on role
    const getHeaderText = () => {
        if (isInstructor) return "My Created Courses";
        return "My Courses";
    };

    // Get empty state message based on role
    const getEmptyMessage = () => {
        if (!user?._id) return "Please log in to view your courses.";
        if (isInstructor) return "You haven't created any courses yet. Click 'Create Course' to get started!";
        return "You are not enrolled in any courses yet. Click 'Enroll in Course' to get started!";
    };

    return (
        <section className="grid grid-cols-6 grid-rows-2 p-6 mt-16 md:gap-4 border rounded-lg shadow-2xl w-full min-h-82 max-h-100 bg-white dark:bg-gray-800 justify-center">
            <ToastContainer position="top-center" theme="dark" autoClose={3000} />

            <div className="flex flex-col gap-2 col-start-5 row-start-1 col-span-2 justify-self-end self-start">
                {isStudent && (
                    <>
                        <button
                            type="button"
                            onClick={() => setShowAllCourses(true)}
                            className="focus:outline-none text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 hover:cursor-pointer">
                            + Enroll in Course
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowAllCourses(true)}
                            className="focus:outline-none text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 hover:cursor-pointer">
                            View All Courses
                        </button>
                    </>
                )}

                {isInstructor && (
                    <>
                        <button
                            type="button"
                            onClick={() => navigate('/instructor/create-course')}
                            className="focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900 hover:cursor-pointer">
                            + Create Course
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowAllCourses(true)}
                            className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 hover:cursor-pointer">
                            View All Courses
                        </button>
                    </>
                )}
            </div>

            <section className="row-start-1 col-start-1 col-span-4 justify-self-start flex flex-col gap-3">
                <h1 className="font-bold text-gray-900 dark:text-white mb-4 md:mb-0 lg:text-3xl">
                    {getHeaderText()}
                </h1>

                {error && (
                    <p className="text-red-600 text-sm">Error: {error}</p>
                )}

                {!user?._id && (
                    <p className="text-yellow-600 text-sm">Please log in to see your courses.</p>
                )}

                <ul className="justify-items-start flex flex-col gap-4 font-bold text-lg">
                    {displayedCourses && displayedCourses.length > 0 ? (
                        displayedCourses.slice(0, limit).map(course => (
                            <li key={course._id} className="flex flex-row gap-4 items-center w-full">
                                <NavLink
                                    to={`/courses/${encodeURIComponent(course.courseName)}`}
                                    className="border rounded-lg shadow-lg py-3 px-3 flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                        {course.courseCode || "N/A"}
                                    </span>
                                    <span className="text-gray-900 dark:text-white">
                                        {course.courseName}
                                    </span>
                                    {course.status && course.status !== "active" && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${course.status === "draft"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-gray-100 text-gray-600"
                                            }`}>
                                            {course.status}
                                        </span>
                                    )}
                                </NavLink>

                                {/* Student: Unenroll button */}
                                {isStudent && (
                                    <button
                                        type="button"
                                        onClick={() => unenrollFromCourse(course._id)}
                                        disabled={isLoading}
                                        className="font-medium text-sm text-red-600 hover:text-red-800 hover:cursor-pointer disabled:opacity-50">
                                        Unenroll
                                    </button>
                                )}

                                {/* Instructor: Edit and Delete buttons */}
                                {isInstructor && (
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/instructor/edit-course/${course._id}`)}
                                            disabled={isLoading}
                                            className="font-medium text-sm text-blue-600 hover:text-blue-800 hover:cursor-pointer disabled:opacity-50">
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteCourse(course._id)}
                                            disabled={isLoading}
                                            className="font-medium text-sm text-red-600 hover:text-red-800 hover:cursor-pointer disabled:opacity-50">
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-600 dark:text-gray-400">
                            {getEmptyMessage()}
                        </li>
                    )}
                </ul>

                {displayedCourses.length > limit && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        + {displayedCourses.length - limit} more courses
                    </p>
                )}
            </section>
        </section>
    )
}

export default Courses;
