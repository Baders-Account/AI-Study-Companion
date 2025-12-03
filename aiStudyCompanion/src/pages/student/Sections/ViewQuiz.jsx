import React, { useMemo, useState, useEffect } from "react";

const URL = "https://backend-phi-topaz.vercel.app/api/quizz"

function ViewQuiz() {
const [quizzes, setQuizzes] = useState(false);
const [showAllQuizzes, setShowAllQuizzes] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// to show first three quizzez
const limit = 3;
function getCollapsedList(list,showAll,limit){
    if(showAll){
        return list;
    }
    else{
        return list.slice(0,limit);
    }
}

const visibleQuizzes = useMemo(()=>{
    getCollapsedList(quizzes,setQuizzes,3),[quizzes, showAllQuizzes]
});


// fetch the quizzez
useEffect(()=>{
    const fetchQuizzes = async()=>{
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(URL);
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setQuizzes(result);
        } catch (error) {
            console.log(error);
            setError(error.message);
        }finally{
            loading(false);
        }
        
    };
    fetchQuizzes()
},[]);

// delete the Quiz
const handleDelete = async(id) =>{
    setLoading(true);
    setError(null);
    try {
        const response = await fetch(`${URL}/${id}`,{
            method: "DELETE",
        });
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        setQuizzes((prev) => prev.filter((q)=> q.id !== id));
    } catch (error) {
        console.log(error);
        setError(error.message);
    }
    finally{
        loading(false);
    }
};


return (
     <div className="flex flex-col rounded-2xl border shadow-lg p-5 bg-white dark:bg-gray-800">
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          View Quizzes
        </h2>
        <p className="text-sm text-gray-500">
          toggle to list all.
        </p>
      </header>

      {error && <p className="text-red-600 text-sm mb-2">Error: {error}</p>}
      {loading && <p className="text-gray-500 text-sm mb-2">Loading...</p>}

      <ul className="flex-1 space-y-2 overflow-auto pr-1">
        {visibleQuizzes.map((q) => (
          <li key={q.id} className="rounded-lg border p-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{q.quizName}</p>
              <p className="text-xs text-gray-500">Course: {q.course}</p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={q.quizLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline"
              >
                Open
              </a>
              <button
                type="button"
                onClick={() => handleDelete(q.id)}
                disabled={loading}
                className="text-xs text-red-700 hover:text-red-900"
              >
                delete
              </button>
            </div>
          </li>
        ))}

        {!loading && visibleQuizzes.length === 0 && (
          <li className="text-sm text-gray-500">No quizzes available.</li>
        )}
      </ul>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowAllQuizzes((s) => !s)}
          className="w-full text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          {showAllQuizzes ? "Show first 3" : "View all quizzes"}
        </button>
      </div>
    </div>
);
}export default ViewQuiz