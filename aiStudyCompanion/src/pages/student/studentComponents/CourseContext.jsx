import React,{ createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { useEffect, useState } from "react"
export const CoursesContext = React.createContext();
import Courses from './Courses';
import Progress from './Progress';
function CourseContext({children}){
    const [courses, setCourses] = useState([]);
     const url = "http://localhost:3000/api/courses"
    useEffect(()=>{
    
                const fetchCourses= async () =>{
                    try{
                            const response = await fetch(url);
                            if(!response.ok){
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            const result = await response.json();
                            setCourses(result);
                            console.log(result);
                    }
                    catch(err){
                        console.log(err);
                    }
    
                    finally{
    
                        console.log("loading")
                    }
                }
                fetchCourses()
    
            },[courses])

    return(
        <CoursesContext.Provider value={{courses, setCourses}}>
            {children}

        </CoursesContext.Provider>
    );

}

export default CourseContext