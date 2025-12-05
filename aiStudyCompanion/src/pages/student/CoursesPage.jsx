import React from "react";
import { Link } from "react-router-dom";
import CreateViewNotes from "./Sections/CreateViewNotes"
import AiAssistant from "./Sections/AiAssistant"
import ViewQuiz from "./Sections/ViewQuiz"
import { useParams } from "react-router-dom";

export default function CoursesPage() {
  const {courseName} = useParams();

  const decodedCourseName= decodeURIComponent(courseName);
  return (
    <section className="p-6 mt-16 w-full bg-white dark:bg-gray-900">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{decodedCourseName}</h1>
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
