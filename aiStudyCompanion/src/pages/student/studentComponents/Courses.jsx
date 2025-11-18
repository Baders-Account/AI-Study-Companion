import { useEffect, useState } from "react"
import { BrowserRouter, NavLink } from "react-router-dom";
import Progress from "./Progress";
import React,{  useContext } from 'react';
import {CoursesContext} from './CourseContext'



function Courses(){
         const shared = useContext(CoursesContext)

        
        const [inputValue, setInputValue] = useState("");

        const addCourse = (e) => {
                console.log("im clocked")
                const newCourse = { id:Date.now() , courseName:inputValue}
                shared.setCourses([...shared.courses,newCourse])
        }

     const removeCourse = (e) => {
            const courseID= e.id
            shared.setCourses(shared.courses.filter(course => (

                course.id != courseID   
            )
        ))
        }

 
    
    return(
     
       
       
        <section className="grid grid-cols-6 grid-rows-2  p-6 mt-16 md:gap-4 border rounded-lg shadow-2xl w-full min-h-64 bg-white dark:bg-gray-800 justify-center">
            
            
            
            
            <button type="button" onClick={addCourse} className="col-start-5 row-start-1 col-span-2 justify-self-end self-start  focus:outline-none text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2  mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"> Add a course</button>
             
             
            <section className=" inline-block row-start-1 col-start-1 col-span-4 justify-self-start flex flex-col gap-2 ">
                <h1 className=" font-bold text-gray-900 dark:text-white mb-4   md:mb-0 lg:text-3xl lg:row-start-1 lg:col-start-1 lg:justify-self-start lg:self-start">
                Courses
            </h1>
            
             <input name="input" type="text" placeholder=" Type here" onChange={(e) => setInputValue(e.target.value) } className="p-2  mb-1 bg-gray-200  rounded-lg "></input>
          
            <ul className="justify-items-start   flex flex-col gap-4 font-bold text-lg">
                
                {shared.courses !=null && shared.courses.length >0 ? (
                    
                    shared.courses.map(course =>(
                        
                            <li key={course.id}>


                                <NavLink to={`/${course.courseName}`} className="border rounded-lg shadow-lg py-3 px-3 flex flex-row justify-center"> {course.courseName} </NavLink>
                            </li>
                           
                                
                                
                                
                            ))
                            
                            
                            
                            
                        ): (
                            <li>
                            You did not add any Course.
                        </li>
                )}
                
                
               
                

            </ul>

            </section> 

        </section>

                
   
                
             
        

    )
}

export default Courses