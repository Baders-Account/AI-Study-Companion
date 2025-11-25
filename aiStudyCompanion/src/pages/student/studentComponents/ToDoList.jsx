import { useState,useEffect } from "react"
import { Button } from "../../../components/Button";


function ToDoList(){
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const url = "http://localhost:3000/api/tasks"

    // a table for tasks
        useEffect(()=>{
        
                    const fetchTasks= async () =>{
                        try{
                                const response = await fetch(url);
                                if(!response.ok){
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                const result = await response.json();
                                setTasks(result);
                                
                        }
                        catch(err){
                            console.log(err);
                        }
        
                        
                    }
                    fetchTasks();
        
                },[tasks])
    
    

    // This should be a post method
    const  addTask= async ()=> {
        const userInput = inputValue    
        setInputValue('');
        try{
                const response = await fetch(`${url}/add-todo`, {

                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        _id: new Date(),
                        text:userInput,
                        completed: false
                    } )

                });
                if (!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

           
             
            
           
            
            

            }
            catch(err){
                console.log(err);
            }
    };

    // care for this too
    const toggleComplete= async(e) =>{
           
            const specificTask= tasks.find(course=> course._id == e.target.value
            )
           
            const isClicked = !specificTask.completed;
           
            try{
                const response = await fetch(`${url}/toggle`, {
                    method:'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: e.target.value,
                        completed: isClicked
                    } )
                })
                if (!response.ok){
                     throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
             catch(err){
                console.log(err);
            }
            
    };

    // care for this 
   const clearAll= async()=>{
        
        try{
            const response = await fetch(`${url}/clearAll`,{
                method:'DELETE'

            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                 }
                  }
             catch(err){
                    console.log(err);
                    }
        };
    

    return(

      
        
        <section className="relative grid grid-cols-12 grid-rows-2 gap-1 p-6 mt-16 items-stretch border rounded-lg shadow-lg w-full h-full  bg-white dark:bg-gray-800 justify-center  ">
            
            
            <div className="flex flex-col flex-shrink items-stretch col-start-11 col-span-2">

            <button onClick={addTask} type="button" disabled={!inputValue} className={`focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${!inputValue ? "bg-gray-400 cursor-not-allowed" : "bg-gray-700 hover:bg-red-800 cursor-pointer"} focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900`}>Add a task</button>

            <button onClick={clearAll} type="button" className="focus:outline-none text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2  mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 cursor-pointer"> Clear All</button>
            </div>
            
            <div className="flex flex-col gap-2 col-start-1 self-start  row-start-1 row-span-2 col-span-8 ">
            <h1 className=" font-bold text-gray-900 dark:text-white mb-4   md:mb-0 lg:text-3xl lg:row-start-1 lg:col-start-1 lg:justify-self-start lg:self-start">
                To Do List
            </h1>
            {!inputValue && (
                <p className="text-red-600  text-sm mt-1">This field is required.</p>)}
            <input name="input" type="text" value={inputValue} placeholder=" Type here" className="bg-gray-200 ml-3 p-2 rounded  " onChange={(e) => setInputValue(e.target.value)}></input>
          
            <ul className="relative flex flex-col items-stretch gap-2 ml-3 p-2 ">
                
                {tasks.length > 0 ? (tasks.map(task => (
                    <li key={task._id} className=" flex flex-row gap-4 justify-around self-start" >
                            
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
                            <input type="checkbox" value={task._id} onChange={toggleComplete}  ></input>
                            </li>
                        
                    ))) : (
                        <li className="absolute text-lg font-bold">
                        There isn't any task added yet.
                        

                    </li>

)
}
            </ul>
        </div>
        </section>
    
       
        );

}

export default ToDoList