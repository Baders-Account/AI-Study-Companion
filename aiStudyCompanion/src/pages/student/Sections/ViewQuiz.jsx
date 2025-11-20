import React, { useMemo, useState } from "react";
import { getCollapsedList, SAMPLE_QUIZZES } from "../studentComponents/utils";


function ViewQuiz() {
const [quizzes] = useState(SAMPLE_QUIZZES);
const [showAllQuizzes, setShowAllQuizzes] = useState(false);


const visibleQuizzes = useMemo(() => getCollapsedList(quizzes, showAllQuizzes, 3), [quizzes, showAllQuizzes]);


return (
    <article className="flex flex-col rounded-2xl border shadow-lg p-5 bg-white dark:bg-gray-800">
        <header className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">View Quizzes</h2>
            <p className="text-sm text-gray-500">Shows 3 by default; toggle to list all.</p>
        </header>


        <ul className="flex-1 space-y-2 overflow-auto pr-1">
            {visibleQuizzes.map((q) => (
                <li key={q.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="font-medium">{q.title}</p>
                            <p className="text-xs text-gray-500">Topic: {q.topic}</p>
                        </div>
                        <a href={q.link} className="text-sm underline" onClick={(e)=> e.preventDefault()}>Open</a>
                    </div>
                 </li>
            ))}
            {visibleQuizzes.length === 0 && (
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
    </article>
);
}export default ViewQuiz