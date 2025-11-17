import { useState } from "react"
import { Button } from "../../../components/Button";


function ToDoList(){
    const [tasks, setTasks] = useState([{id:0,name: 'i want you', completed:false }]);
    const [inputValue, setInputValue] = useState('');
    
    const addTask = (e) => {
            const newTask = {id: Date.now(), text:e.target.value, completed: false };
            setTasks([...tasks, newTask])
    };
    const toggleComplete= (e) => {
            console.log("please");
    };

    return(

      
        
        <section className="relative flex flex-col justify-between p-6 mt-15  border rounded-lg shadow-lg   ">
            
            

            <button onClick={addTask} type="button" className="absolute top-0 right-0 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 cursor-pointer"> Add a task</button>
            

            <input type="text" className="bg-gray-500 max-w-1/2" onChange={(e) => setInputValue(e.target.value)}></input>
          
            <ul>
                {tasks.map(task => (
                        <li key={task.id} className="flex flex-wrap gap-4" >
                            {task.name}

                            <input type="checkbox" ></input>
                            </li>
                        
                ))
                }
            </ul>
        </section>
    
       
        );

}

export default ToDoList