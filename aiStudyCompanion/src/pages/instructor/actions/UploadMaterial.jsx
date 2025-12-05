import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://backend-phi-topaz.vercel.app/api";

export default function UploadMaterial() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    courseName: "",
  });

  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch courses for dropdown
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch(`${API_URL}/courses`);
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (err) {
        console.log("Failed to fetch courses:", err);
      }
    }
    fetchCourses();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFileName(selectedFile.name);

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = () => {
      setFileContent(reader.result);
    };
    reader.onerror = () => {
      setError("Failed to read file");
    };
    reader.readAsDataURL(selectedFile);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.title.trim() || !form.courseName || !fileContent) {
      setError("Please fill in title, select a course, and choose a file.");
      setLoading(false);
      return;
    }

    const uploadedBy = localStorage.getItem("currentUser") || "unknown";
    const fileExtension = fileName.split('.').pop().toLowerCase();

    try {
      const response = await fetch(`${API_URL}/materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          courseName: form.courseName,
          type: fileExtension,
          fileContent,
          fileName,
          uploadedBy,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      navigate("/instructor");
    } catch (err) {
      setError(err.message || "Failed to upload material");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Upload Material</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="e.g., Week 1 Slides"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description (optional)</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 h-24"
            placeholder="Brief description of the material..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Course *</label>
          <select
            name="courseName"
            value={form.courseName}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course._id || course.id} value={course.courseName}>
                {course.courseName}
              </option>
            ))}
          </select>
          {courses.length === 0 && (
            <p className="text-xs text-gray-500 mt-1">No courses available. Add courses first.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">File *</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border rounded-lg px-3 py-2"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.txt"
            required
          />
          {fileName && (
            <p className="text-xs text-gray-500 mt-1">Selected: {fileName}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-gray-700 text-white hover:bg-red-800 transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg border"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
