import { useEffect, useState } from "react"
import { BrowserRouter, NavLink } from "react-router-dom";
import Progress from "./Progress";
import React,{  useContext } from 'react';
import {CoursesContext} from './CourseContext'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CourseContext from "./CourseContext";
import PopUpCourses from "./PopUpCourses";
import StudentDashboard from "../StudentDashboard";
import { ShowContext } from "../../../App";

function Courses(){
         const shared = useContext(CoursesContext) // courses are here
        const limit = 3; // so that the courses does not overlap if had many courses added
         const [courseAdded,setCourseAdded] =useState(1);         
        const [inputValue, setInputValue] = useState("");
        const { setShowAllCourses } = useContext(ShowContext);
        
        function addCourse() {
               
                const newCourse = { id:Date.now() , courseName:inputValue}
                setInputValue('');
                console.log(`before adding ${courseAdded}`)
                setCourseAdded(courseAdded+1);
                shared.setCourses([...shared.courses,newCourse])
                console.log(`after adding ${courseAdded}`)
                
                if(courseAdded>= limit){
                    toast("Your course has been added, check view courses button to check all courses",{autoClose:3000})
                }
        }

     

    
    
    
    return(
     
       
       
        <section className="grid grid-cols-6 grid-rows-2  p-6 mt-16 md:gap-4 border rounded-lg shadow-2xl w-full min-h-82 max-h-100 bg-white dark:bg-gray-800 justify-center">
            
            
            <ToastContainer position="top-center" theme="dark" autoClose={3000}/>
                                    
                    
            <div className="flex flex-col gap-2 col-start-5 row-start-1 col-span-2 justify-self-end self-start">

            <button type="button" onClick={addCourse} disabled={!inputValue} className="focus:outline-none text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5    dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"> Add a course</button>
           

            <button type="button" onClick={() => setShowAllCourses(true)} className="focus:outline-none text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"> View Courses </button>
        
            
            
            </div>
             
             
            <section className=" row-start-1 col-start-1 col-span-4 justify-self-start flex flex-col gap-4 ">
                <h1 className=" font-bold text-gray-900 dark:text-white mb-4   md:mb-0 lg:text-3xl lg:row-start-1 lg:col-start-1 lg:justify-self-start lg:self-start">
                Courses
            </h1>
             
             <input name="input" type="text" placeholder=" Type here" value={inputValue} onChange={(e) => setInputValue(e.target.value) } className="p-2 bg-gray-200  rounded-lg "></input>
          
            <ul className="justify-items-start   flex  flex-col gap-8 font-bold text-lg ">
                
                {shared.courses !=null && shared.courses.length >0 ? (
                    
                    shared.courses.slice(0,limit).map(course =>(
                        
                            <li key={course.id} className="flex flex-row gap-8" >

                                

                                <NavLink to={`/${course.courseName}`} className=" border rounded-lg shadow-lg py-3 px-3   w-full"> 
                                {course.courseName} 
                                
                                
                                 </NavLink>

                                 <button type="button" value={course.id} onClick={(e)=> { shared.setCourses(shared.courses.filter(course => (course.id != e.target.value)));console.log(`before removing ${courseAdded}`); if(courseAdded>0){setCourseAdded(courseAdded-1);}; console.log(`after removing ${courseAdded}`); }} className="ml-auto font-bold hover:text-blue-400 hover:cursor-pointer">remove</button>
                                
                              
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