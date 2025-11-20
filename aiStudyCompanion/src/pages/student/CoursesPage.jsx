import React from "react";
import { Link } from "react-router-dom";
import NotesSection from "./sections/NotesSection";
import AiAssistantSection from "./sections/AiAssistantSection";
import QuizzesSection from "./sections/QuizzesSection";

function CoursesPage() {
  return (
    <section className="p-6 mt-16 w-full bg-white dark:bg-gray-900">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Page</h1>
        <Link to="/Dashboard" className="text-sm font-medium underline">
          Back to dashboard
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CreateViewNotes />
        <AiAssistant />
        <ViewQuiz />
      </div>
    </section>
  );
}

export default CoursePage