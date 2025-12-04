import { useState } from "react";
import { useNavigate } from "react-router-dom";

const URL = "https://backend-phi-topaz.vercel.app/api/quizz";


function CreateQuiz() {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(URL,{
        method: "POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(form),
      });
      if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      navigate("/instructor"); // go back after submit
    } catch (error) {
      console.log(error);
      setError(error.message);
    }finally{
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create Quiz</h1>
      {error && <p className="text-red-600 text-sm mb-2">Error: {error}</p>}
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
            disabled = {loading}
            className="px-5 py-2.5 rounded-lg bg-gray-700 text-white hover:bg-red-800 transition"
          >
            {loading ? "Saving..." : "Create"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg border"
            disabled = {loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}export default CreateQuiz
