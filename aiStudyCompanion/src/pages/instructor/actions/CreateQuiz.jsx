import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config";

const URL = `${API_BASE_URL}/quizz/ai-create`;


function CreateQuiz() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    quizName: "",
    course: "",
    notesText: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form data before sending
    if (!form.quizName.trim() || !form.course.trim() || !form.notesText.trim()) {
      setError("All fields are required and cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizName: form.quizName.trim(),
          course: form.course.trim(),
          notesText: form.notesText.trim()
        }),
      });

      // Check content type before parsing
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        // Response is JSON, parse it
        data = await response.json();
      } else {
        // Response is not JSON (likely HTML error page)
        const text = await response.text();
        throw new Error(`Server returned ${response.status} error. The API endpoint may not be available.`);
      }

      if (!response.ok) {
        // Get error message from response body
        const errorMessage = data.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      // Success - navigate to instructor dashboard
      navigate("/instructor");
    } catch (error) {
      // Handle network errors, JSON parsing errors, or API errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError("Network error. Please check your internet connection and ensure the backend server is running.");
      } else if (error.message.includes('Unexpected token') || error.message.includes('JSON')) {
        setError("Server error: The backend returned an invalid response. Please check if the API endpoint is correct and the server is running.");
      } else {
        setError(error.message || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create Quiz</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 font-medium">Error: {error}</p>
          <p className="text-red-500 dark:text-red-500 text-sm mt-1">Please check your inputs and try again.</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">Quiz Name</label>
          <input
            name="quizName"
            value={form.quizName}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="e.g., Midterm Quiz"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Course</label>
          <input
            name="course"
            value={form.course}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="e.g., Intro to Algorithms"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Notes Text</label>
          <textarea
            name="notesText"
            value={form.notesText}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 h-40"
            placeholder="Paste notes to generate questions"
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-gray-700 text-white hover:bg-red-800 transition"
          >
            {loading ? "Saving..." : "Create"}
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
} export default CreateQuiz
