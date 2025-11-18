import { useState } from "react"
import { Button } from "../../../components/Button";


function ToDoList(){
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState('');
    
    function addTask () {
            
            const newTask = {id: Date.now(), text:inputValue, completed: false };
            
           
            setTasks([...tasks, newTask]);
            setInputValue('');
    };
    const toggleComplete=(e) =>{
            const id= Number(e.target.value) 
            setTasks(tasks.map(task =>
                task.id == id ? {...task, completed: !task.completed}: task
            ));
            console.log(e.target.value)
            console.log(tasks);
    };

    function clearAll(){
        setTasks([]);
    };
    

    return(

      
        
        <section className="relative flex flex-col gap-1 p-6 mt-15  border rounded-lg shadow-lg min-h-full  ">
            
            
            <div className="flex flex-col flex-shrink absolute top-0 right-0">

            <button onClick={addTask} type="button" disabled={!inputValue} className="focus:outline-none text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 cursor-pointer"> Add a task</button>
            <button onClick={clearAll} type="button" className="focus:outline-none text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 cursor-pointer"> Clear All</button>
            </div>
            

            <input name="input" type="text" value={inputValue} placeholder=" Type here" className="bg-gray-200 p-1 rounded max-w-1/2" onChange={(e) => setInputValue(e.target.value)}></input>
          
            <ul className="relative ml-3 min-h-1/2 max-w-1/2">
                
                {tasks.length > 0 ? (tasks.map(task => (
                        <li key={task.id} className="flex flex-wrap gap-4" >
                            
                            {task.completed ? (
                                <div className="line-through">

                                <strong>Task: </strong> {task.text}
                                </div>
                                
                            ) : (
                                <div>

                                <strong>Task: </strong> {task.text}
                                </div>
                                
                            )
                                
                            }
                            <input type="checkbox" value={task.id} onChange={toggleComplete}  ></input>
                            </li>
                        
                ))) : (
                    <li className="absolute text-lg font-bold">
                        There isn't any task added yet.
                        

                    </li>

                )
                }
            </ul>
        </section>
    
       
        );

}

export default ToDoList