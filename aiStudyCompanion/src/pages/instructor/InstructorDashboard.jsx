import ToDoList from "../student/studentComponents/toDoList";
import Courses from "../student/studentComponents/Courses";
import Progress from "../student/studentComponents/Progress";
import { useContext, useState } from "react";
import { ShowContext } from "../../App";
import PopUpCourses from "../student/studentComponents/PopUpCourses";
import InstructorActionCard from "./instructorComponents/InstructorActionCard";


function InstructorDashboard() {
    const [sharedData, setSharedData] = useState([]);
    const { showAllCourses, setShowAllCourses } = useContext(ShowContext);

    return(



        <section className="mt-9 sm:flex sm:flex-col md:flex md:flex-col  lg:grid lg:grid-flow-col  lg:grid-rows-12  lg:grid-cols-12      ">

        <section className=" lg:row-start-1 lg:col-start-7  lg:col-span-5 lg:row-span-2  justify-self-around">
            <ToDoList/>


        </section>



            <section className="col-start-2  col-span-4 row-start-1 row-end-1 ">

            <InstructorActionCard />
            </section>

            <section className="col-start-2  col-span-4 row-start-2 row-end-2 ">

            <Courses  />
            </section>



       <section className="col-start-2 col-span-4 row-start-3 ">

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



export default InstructorDashboard;
