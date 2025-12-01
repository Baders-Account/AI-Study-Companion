import { useEffect, useState, useContext } from "react"
import { BrowserRouter, NavLink, useNavigate } from "react-router-dom";
import Progress from "./Progress";
import React from 'react';
import { CoursesContext } from './CourseContext'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShowContext } from "../../../App";

function Courses(){
    const shared = useContext(CoursesContext); // courses are here
    const limit = 3; // limit courses displayed
    const [courseAdded,setCourseAdded] = useState(1);         
    const [inputValue, setInputValue] = useState("");
    const { setShowAllCourses } = useContext(ShowContext);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);  
    const url = "https://backend-phi-topaz.vercel.app/api/courses"

    const addCourse = async () => {
        const userInput = inputValue;
        setInputValue('');
        setCourseAdded(prev => prev + 1);
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: Date.now(),
                    courseName: userInput
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

           

            if (courseAdded + 1 >= limit) {
                toast(
                    "Your course has been added, check view courses button to check all courses",
                    { autoClose: 3000 }
                );
            }

        } catch (err) {
            console.log(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const removeCourse = async (courseId) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${url}/${courseId}`, {
                method:'DELETE'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // remove course locally
           console.log(courseId);
            setCourseAdded(prev => Math.max(prev - 1, 0));
        } catch (err) {
            console.log(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <section className="grid grid-cols-6 grid-rows-2  p-6 mt-16 md:gap-4 border rounded-lg shadow-2xl w-full min-h-82 max-h-100 bg-white dark:bg-gray-800 justify-center">
            <ToastContainer position="top-center" theme="dark" autoClose={3000}/>

            <div className="flex flex-col gap-2 col-start-5 row-start-1 col-span-2 justify-self-end self-start">
                <button
                    type="button"
                    onClick={addCourse}
                    disabled={!inputValue || isLoading}
                    className={`focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-white ${!inputValue || isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-700 hover:bg-red-800 cursor-pointer"}`}>
                    {isLoading ? "Loading..." : "Add a course"}
                </button>

                <button
                    type="button"
                    onClick={() => setShowAllCourses(true)}
                    className="focus:outline-none text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 hover:cursor-pointer">
                    View Courses
                </button>
            </div>

            <section className="row-start-1 col-start-1 col-span-4 justify-self-start flex flex-col gap-4">
                <h1 className="font-bold text-gray-900 dark:text-white mb-4 md:mb-0 lg:text-3xl">
                    Courses
                </h1>

                {!inputValue && (
                    <p className="text-red-600 text-sm mt-1">This field is required.</p>
                )}

                {error && (
                    <p className="text-red-600 text-sm mt-1">Error: {error}</p>
                )}

                <input
                    name="input"
                    type="text"
                    placeholder=" Type here"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="p-2 bg-gray-200 rounded-lg"
                    disabled={isLoading}
                />

                <ul className="justify-items-start flex flex-col gap-8 font-bold text-lg">
                    {shared.courses && shared.courses.length > 0 ? (
                        shared.courses.slice(0,limit).map(course => (
                            <li key={course.id} className="flex flex-row gap-8">
                                <NavLink to={`/courses/${encodeURIComponent(course.courseName)}`} className="border rounded-lg shadow-lg py-3 px-3 w-full">
                                    {course.courseName}
                                </NavLink>

                                <button
                                    type="button"
                                    onClick={() => removeCourse(course.id)}
                                    disabled={isLoading}
                                    className="ml-auto font-bold hover:text-red-800 hover:cursor-pointer">
                                    remove
                                </button>
                            </li>
                        ))
                    ) : (
                        <li>
                            You did not add any Course.
                        </li>
                    )}
                </ul>
            </section>
        </section>
    )
}

export default Courses;
