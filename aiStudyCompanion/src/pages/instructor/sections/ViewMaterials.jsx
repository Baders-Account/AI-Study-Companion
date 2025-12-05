import { useState, useEffect, useMemo } from "react";

const API_URL = "https://backend-phi-topaz.vercel.app/api";

export default function ViewMaterials() {
  const [materials, setMaterials] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 3;

  const visibleMaterials = useMemo(
    () => (showAll ? materials : materials.slice(0, limit)),
    [materials, showAll]
  );

  // Fetch materials on mount
  useEffect(() => {
    async function fetchMaterials() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/materials`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setMaterials(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMaterials();
  }, []);

  // Download file
  async function handleDownload(id, fileName) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/materials/${id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const doc = await res.json();

      // Convert base64 to blob and trigger download
      const link = document.createElement("a");
      link.href = doc.fileContent;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Delete material
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this material?")) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/materials/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Get file type icon/badge
  function getTypeBadge(type) {
    const colors = {
      pdf: "bg-red-100 text-red-800",
      doc: "bg-blue-100 text-blue-800",
      docx: "bg-blue-100 text-blue-800",
      ppt: "bg-orange-100 text-orange-800",
      pptx: "bg-orange-100 text-orange-800",
      png: "bg-green-100 text-green-800",
      jpg: "bg-green-100 text-green-800",
      jpeg: "bg-green-100 text-green-800",
      txt: "bg-gray-100 text-gray-800",
    };
    return colors[type?.toLowerCase()] || "bg-gray-100 text-gray-800";
  }

  return (
    <div className="flex flex-col rounded-2xl border shadow-lg p-5 bg-white dark:bg-gray-800">
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Uploaded Materials
        </h2>
        <p className="text-sm text-gray-500">
          {materials.length} material{materials.length !== 1 ? "s" : ""} uploaded
        </p>
      </header>

      {error && <p className="text-red-600 text-sm mb-2">Error: {error}</p>}
      {loading && <p className="text-gray-500 text-sm mb-2">Loading...</p>}

      <ul className="flex-1 space-y-2 overflow-auto pr-1">
        {visibleMaterials.map((m) => (
          <li
            key={m.id}
            className="rounded-lg border p-3 flex items-center justify-between gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{m.title}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${getTypeBadge(m.type)}`}
                >
                  {m.type?.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-500">Course: {m.courseName}</p>
              {m.description && (
                <p className="text-xs text-gray-400 truncate">{m.description}</p>
              )}
              <p className="text-xs text-gray-400">
                Uploaded by: {m.uploadedBy} |{" "}
                {new Date(m.uploadedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDownload(m.id, m.fileName)}
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Download
              </button>
              <button
                type="button"
                onClick={() => handleDelete(m.id)}
                disabled={loading}
                className="text-xs text-red-700 hover:text-red-900"
              >
                Delete
              </button>
            </div>
          </li>
        ))}

        {!loading && visibleMaterials.length === 0 && (
          <li className="text-sm text-gray-500">No materials uploaded yet.</li>
        )}
      </ul>

      {materials.length > limit && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="w-full text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            {showAll ? `Show first ${limit}` : "View all materials"}
          </button>
        </div>
      )}
    </div>
  );
}
