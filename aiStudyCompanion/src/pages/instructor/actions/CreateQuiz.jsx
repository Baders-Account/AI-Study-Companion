import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    quizName: "",
    course: "",
    quizLink: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: send `form` to your backend
    console.log("Create Quiz payload:", form);
    navigate("/instructor"); // go back after submit (optional)
  }

  return (
    <main className="max-w-2xl mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create Quiz</h1>
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
          <label className="block text-sm font-medium mb-2">Quiz Link</label>
          <input
            type="url"
            name="quizLink"
            value={form.quizLink}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="https://..."
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-gray-700 text-white hover:bg-red-800 transition"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg border"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
