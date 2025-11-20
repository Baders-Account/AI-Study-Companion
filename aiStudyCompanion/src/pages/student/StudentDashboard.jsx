import ToDoList from "./studentComponents/toDoList";
import ActionCard from "./studentComponents/ActionCard";
import Courses from "./studentComponents/Courses";
import Progress from "./studentComponents/Progress";
import { Link,Route, Routes,BrowserRouter } from "react-router-dom";
import { useContext, useState } from "react";
import CourseContext from "./studentComponents/CourseContext";
import { ShowContext } from "../../App";
import PopUpCourses from "./studentComponents/PopUpCourses";
 

function StudentDashboard() {
    const [sharedData, setSharedData] = useState([]);
    const { showAllCourses, setShowAllCourses } = useContext(ShowContext);

    return(
        
    
        
        <section className="mt-9 sm:flex sm:flex-col md:grid md:grid-rows-6 md:grid-cols-6 lg:grid lg:grid-flow-col  lg:grid-rows-12  lg:grid-cols-12      ">

        <section className=" lg:row-start-1 lg:col-start-7  lg:col-span-5 lg:row-span-2  justify-self-around">
            <ToDoList/>
              
        
        </section>
        
      


            <section className="col-start-2  col-span-4 row-start-1 row-end-1 ">

            <Courses  />
            </section>
            

          
       <section className="col-start-2 col-span-4 row-start-2 ">

            <Progress/>
       </section>
        <div className="mt-10">

          { showAllCourses !== null ? (
              
              
              showAllCourses && (<PopUpCourses onClose={() => setShowAllCourses(false)} />)):(<h1>How</h1>)
              
            }
            
            </div>
        
        
        
        
        
        

        </section>
        

       
        
        
        
    )

}



export default StudentDashboard;