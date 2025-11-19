import { CoursesContext } from './CourseContext'
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'

function PopUpCourses({ onClose }) {
  const shared = useContext(CoursesContext)

  return (
    <div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex justify-center max-h-full ">
      <div className="bg-gray-900 text-white rounded-lg  p-6 max-h-3/4 min-w-1/2 shadow-2xl">
        <button
          className="ml-auto mb-4 block text-xl font-bold hover:text-red-400"
          onClick={onClose}
        >
          ×
        </button>
 <section className=" justify-self-start flex flex-col gap-2 ml-4 ">
                <h1 className=" font-bold text-white-900 dark:text-white mb-4   md:mb-0 lg:text-3xl lg:row-start-1 lg:col-start-1 lg:justify-self-start lg:self-start">
                All Courses
            </h1>
             
             
          
            <ul className="justify-items-start   flex flex-row flex-wrap gap-4 font-bold text-lg">
                
                {shared.courses!=null &&shared.courses.length >0 ? (
                    
                    shared.courses.map(course =>(
                        
                            <li key={course.id} >


                                <NavLink to={`/${course.courseName}`} className="border rounded-lg shadow-lg py-3 px-3 flex flex-row justify-center"> {course.courseName}  </NavLink>
                                
                            </li>
                           
                               
                            ))
                            
                            
                            
                            
                        ): (
                            <li>
                            You did not add any Course.
                        </li>
                )}
                
                                
                                
                
                
               
                
                
            </ul>
            

            </section> 

      </div>
    </div>
  )
}

export default PopUpCourses
