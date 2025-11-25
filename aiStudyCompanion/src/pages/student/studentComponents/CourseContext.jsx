import React, { createContext, useContext, useEffect, useState } from 'react';

export const CoursesContext = React.createContext();

function CourseContext({ children }) {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const url = "http://localhost:3000/api/courses";

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setCourses(result);
            } catch (err) {
                console.log(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []); // empty dependency array prevents infinite refetch

    return (
        <CoursesContext.Provider value={{ courses, setCourses, isLoading, error }}>
            {children}
        </CoursesContext.Provider>
    ); 
}

export default CourseContext;
