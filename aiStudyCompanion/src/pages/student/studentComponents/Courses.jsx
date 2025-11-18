import { useState } from "react"
import { BrowserRouter, NavLink } from "react-router-dom";

function Courses(){
        const [courses,setCourses] = useState([]);
        
        const [inputValue, setInputValue] = useState("");

        const addCourse = (e) => {
                const newCourse = { id:Date.now() , courseName:inputValue}
                setCourses([...courses,newCourse])
        }

      const removeCourse = (e) => {
            const courseID= e.id
            setCourses(courses.filter(course => (

                course.id != courseID   
            )
        ))
        }

 
    
    return(
       
        <section className="grid grid-cols-5 grid-rows-2 p-6 mt-16 md:gap-4 border rounded-lg shadow-lg w-full min-h-64 bg-white dark:bg-gray-800 justify-center">
            <button type="button" onClick={addCourse} className="col-start-4 col-span-2 justify-self-end self-start  focus:outline-none text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"> Add a course</button>
             
             
            <section className="row-start-1 col-start-1 col-span-3">
             <input name="input" type="text" placeholder=" Type here" onChange={(e) => setInputValue(e.target.value) } className="row-start-1 px-2 py-2 me-2 mt-2 mb-2 bg-gray-200  rounded "></input>
          
            <ul className="justify-items-start ml-2 flex flex-col gap-4 font-bold text-lg">
                
                {courses.length>0 ? (
                    
                    courses.map(course =>(
                        <button key={course.id} className="focus:outline-none text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 cursor-pointer">
                            

                                <NavLink to={`\\${course.courseName}`} className="border rounded-lg shadow-lg py-3 px-3 flex flex-row justify-center"> {course.courseName} </NavLink>
                           
                                
                                
                                </button>
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