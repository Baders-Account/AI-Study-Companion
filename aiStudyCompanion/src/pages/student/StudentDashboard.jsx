import ToDoList from "./studentComponents/toDoList";
import ActionCard from "./studentComponents/ActionCard";
import Courses from "./studentComponents/Courses";
import Progress from "./studentComponents/Progress";
import { Link,Route, Routes,BrowserRouter } from "react-router-dom";


function StudentDashboard() {

    return(

        
        
        <section className="mt-9 sm:flex sm:flex-col md:grid md:grid-rows-6 md:grid-cols-6 lg:grid lg:grid-flow-col  lg:grid-rows-12  lg:grid-cols-12   h-full   ">

        <section className=" lg:row-start-1 lg:col-start-7  lg:col-span-7  justify-self-around">
            <ToDoList/>
              
        
        </section>
        <section className=" lg:row-start-1 lg:col-start-2 lg:col-span-4 justify-self-around">

            <ActionCard/>

        </section>

        <section className=" lg:row-start-4 lg:col-start-2 lg:col-span-4">
            <Courses/>
        </section>

        <section className="lg:row-start-4 lg:col-start-7 lg:col-span-4">

            <Progress/>
        </section>
        
        
        
        
        
        

        </section>
        

       
        
        
        
    )

}



export default StudentDashboard;