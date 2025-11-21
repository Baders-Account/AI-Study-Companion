
import {CoursesContext} from './CourseContext'
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { CircularProgress } from '@mui/material';



function Progress(){
    const shared = useContext(CoursesContext)
    const limit = 3 // so that the courses does not overlap if had many courses added
    
    return(
        <section className="grid grid-cols-2 grid-rows-2 p-6 mt-16 md:gap-4 border rounded-lg shadow-lg w-full min-h-82 max-h-100 bg-white dark:bg-gray-800 justify-center ">
                
            <ul className="justify-items-start col-start-1 col-end-2  flex flex-col gap-4 font-bold text-lg">
                <h1 className=" font-bold text-gray-900 dark:text-white mb-4   md:mb-0 lg:text-3xl lg:row-start-1 lg:col-start-1 lg:justify-self-start lg:self-start">
                Progress
            </h1>
                {shared.courses!=null &&shared.courses.length >0  ? (
                    
                    shared.courses.slice(0,limit).map(course =>(
                        
                            
                            <li key={course.id} className='grid grid-cols-2'>


                                <NavLink to={`/courses/${encodeURIComponent(course.courseName)}`} className="border rounded-lg shadow-lg py-3 px-3 flex flex-row justify-center"> {course.courseName} </NavLink>
                                
                                 <div className='col-start-2  place-self-start ' > <CircularProgress variant="determinate" value={25} />
                                </div>

                            </li>
                           
                                
                           
                                
                                
                                
                            ))
                            
                            
                            
                            
                        ): (
                            <li className="justify-self-center">
                            You did not add any Course.
                        </li>
                )}
                
                
                
               
                

            </ul>

           
        </section>
        
        
        

    )

}

export default Progress