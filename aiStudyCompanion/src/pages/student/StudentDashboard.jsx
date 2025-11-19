import ToDoList from "./studentComponents/toDoList";
import ActionCard from "./studentComponents/ActionCard";
import Courses from "./studentComponents/Courses";
import Progress from "./studentComponents/Progress";
import { Link,Route, Routes,BrowserRouter } from "react-router-dom";
import { useContext, useState } from "react";
import CourseContext from "./studentComponents/CourseContext";
import { ShowContext } from "./studentComponents/Courses";
import PopUpCourses from "./studentComponents/PopUpCourses";
 

function StudentDashboard() {
    const [sharedData, setSharedData] = useState([]);
    const { showAllCourses, setShowAllCourses } = useContext(ShowContext);

    return(
        
    
        
        <section className="mt-9 sm:flex sm:flex-col md:grid md:grid-rows-6 md:grid-cols-6 lg:grid lg:grid-flow-col  lg:grid-rows-12  lg:grid-cols-12   h-full   ">

        <section className=" lg:row-start-1 lg:col-start-7  lg:col-span-5  justify-self-around">
            <ToDoList/>
              
        
        </section>
        
      


            <section className="col-start-2  col-span-4 row-start-1 row-end-1 ">

            <Courses  />
            </section>
            

          
       <section className="col-start-2 col-span-4 row-start-4">

            <Progress/>
       </section>
        
          { showAllCourses != null ? (

          
        showAllCourses && (<PopUpCourses onClose={() => setShowAllCourses(false)} />)):(<h1>How</h1>)
                
            }
            
        
        
        
        
        
        

        </section>
        

       
        
        
        
    )

}



export default StudentDashboard;