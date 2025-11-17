import ToDoList from "./studentComponents/toDoList";
import ActionCard from "./studentComponents/ActionCard";


function StudentDashboard() {

    return(

        
        <section className="mt-9 static border  grid grid-rows-2  grid-cols-12   h-full   ">

        <section className=" row-start-1 col-start-8  col-span-4 row-span-2 justify-self-around">
            <ToDoList/>
              
        
        </section>
        <section className=" row-start-1 col-start-3 col-span-4 justify-self-around">

            <ActionCard/>

        </section>

        <section className="row-start-2 col-start-2 ">
            <h4>Courses</h4>
        </section>

        <section className="row-start-2 col-start-1">

            <h4>Progress</h4>
        </section>
        
        
        
        
        
        

        </section>
      
        
        
    )

}



export default StudentDashboard;