import ToDoList from "./studentComponents/toDoList";
import ActionCard from "./studentComponents/ActionCard";


function StudentDashboard() {

    return(

        
        <section className="mt-9 static border  grid grid-rows-12  grid-cols-12   h-full   ">

        <section className=" row-start-1 col-start-7  col-span-4  justify-self-around">
            <ToDoList/>
              
        
        </section>
        <section className=" row-start-1 col-start-2 col-span-4 justify-self-around">

            <ActionCard/>

        </section>

        <section className="border row-start-6 col-start-2  col-span-4">
            <h4>Courses</h4>
        </section>

        <section className="border row-start-6 col-start-7 col-span-4">

            <h4>Progress</h4>
        </section>
        
        
        
        
        
        

        </section>
      
        
        
    )

}



export default StudentDashboard;