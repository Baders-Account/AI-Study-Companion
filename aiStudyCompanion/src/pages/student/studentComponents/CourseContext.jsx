import React,{ useState, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';

export const CoursesContext = React.createContext();
import Courses from './Courses';
import Progress from './Progress';
function CourseContext({children}){
    const [courses, setCourses] = useState([]);

    return(
        <CoursesContext.Provider value={{courses, setCourses}}>
            {children}

        </CoursesContext.Provider>
    );

}

export default CourseContext