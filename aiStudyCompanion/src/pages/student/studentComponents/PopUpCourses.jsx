import { CoursesContext } from './CourseContext'
import { useContext, useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { API_BASE_URL } from "../../../config";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "react-toastify";

function PopUpCourses({ onClose }) {
  const shared = useContext(CoursesContext)
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current enrollments to know which courses user is already in
  const fetchEnrollments = async () => {
    if (!user?._id) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/enrollments?studentId=${user._id}`
      );
      if (response.ok) {
        const data = await response.json();
        setEnrollments(data);
      }
    } catch (err) {
      console.error("Error fetching enrollments:", err);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [user?._id]);

  // Check if user is enrolled in a course
  const isEnrolled = (courseId) => {
    return enrollments.some(e => e.courseId === courseId && e.status === 'active');
  };

  // Enroll in a course
  const enrollInCourse = async (courseId) => {
    if (!user?._id) {
      toast.error("Please log in to enroll in courses");
      return;
    }

    setEnrollingCourseId(courseId);

    try {
      const response = await fetch(`${API_BASE_URL}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: user._id,
          courseId: courseId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast.info("You are already enrolled in this course");
        } else {
          throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
      } else {
        toast.success("Successfully enrolled!", { autoClose: 2000 });
        // Refresh enrollments
        fetchEnrollments();
      }
    } catch (err) {
      console.error("Error enrolling:", err);
      toast.error(err.message || "Failed to enroll");
    } finally {
      setEnrollingCourseId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 text-white rounded-lg p-6 max-h-[80vh] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-2xl lg:text-3xl">
            All Available Courses
          </h1>
          <button
            className="text-3xl font-bold hover:text-red-400 hover:cursor-pointer leading-none"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {!user?._id && (
          <p className="text-yellow-400 mb-4">
            Please log in to enroll in courses.
          </p>
        )}

        {/* Courses List */}
        <div className="overflow-y-auto flex-1">
          <ul className="flex flex-col gap-3">
            {shared.courses != null && shared.courses.length > 0 ? (
              shared.courses.map(course => {
                const enrolled = isEnrolled(course._id);
                const isEnrolling = enrollingCourseId === course._id;

                return (
                  <li key={course._id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      {/* Course Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-400">
                            {course.courseCode || "N/A"}
                          </span>
                          {course.status && course.status !== "active" && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${course.status === "draft"
                                ? "bg-yellow-900 text-yellow-300"
                                : "bg-gray-700 text-gray-300"
                              }`}>
                              {course.status}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-lg text-white">
                          {course.courseName}
                        </h3>
                        {course.instructorName && (
                          <p className="text-sm text-gray-400">
                            Instructor: {course.instructorName}
                          </p>
                        )}
                        {course.semester && (
                          <p className="text-xs text-gray-500">
                            Semester: {course.semester}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <NavLink
                          to={`/courses/${encodeURIComponent(course.courseName)}`}
                          onClick={onClose}
                          className="px-4 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          View
                        </NavLink>

                        {user?._id && (
                          enrolled ? (
                            <span className="px-4 py-2 text-sm font-medium bg-green-800 text-green-200 rounded-lg">
                              ✓ Enrolled
                            </span>
                          ) : (
                            <button
                              onClick={() => enrollInCourse(course._id)}
                              disabled={isEnrolling}
                              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isEnrolling
                                  ? "bg-gray-600 cursor-not-allowed"
                                  : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                              {isEnrolling ? "Enrolling..." : "Enroll"}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="text-center text-gray-400 py-8">
                No courses available.
              </li>
            )}
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default PopUpCourses
