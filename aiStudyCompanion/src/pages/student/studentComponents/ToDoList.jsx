import { useState,useEffect } from "react"
import { Button } from "../../../components/Button";

function ToDoList(){
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const url = "https://backend-phi-topaz.vercel.app/api/tasks"

    // fetch tasks only on mount
    useEffect(()=>{
        const fetchTasks= async () =>{
            setLoading(true);
            setError(null);
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
                setError(err.message);
            }
            finally{
                setLoading(false);
            }
        }
        fetchTasks();
    },[]) // empty dependency array => only runs once

    const addTask= async ()=> {
        const userInput = inputValue    
        setInputValue('');
        setLoading(true);
        setError(null);
        try{
            const response = await fetch(`${url}/add-todo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: new Date(),
                    text:userInput,
                    completed: false
                })
            });
            if (!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const newTask = {_id: new Date().toString(), text: userInput, completed: false};
            setTasks(prev => [...prev, newTask]);
        }
        catch(err){
            console.log(err);
            setError(err.message);
        }
        finally{
            setLoading(false);
        }
    };

    const toggleComplete= async(e) =>{
        const specificTask= tasks.find(course=> course._id == e.target.value)
        const isClicked = !specificTask.completed;
        setLoading(true);
        setError(null);
        try{
            const response = await fetch(`${url}/toggle`, {
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: e.target.value,
                    completed: isClicked
                })
            })
            if (!response.ok){
                 throw new Error(`HTTP error! status: ${response.status}`);
            }
            // update tasks locally
            setTasks(prev => prev.map(task => task._id === e.target.value ? {...task, completed: isClicked} : task));
        }
        catch(err){
            console.log(err);
            setError(err.message);
        }
        finally{
            setLoading(false);
        }
    };

    const clearAll= async()=>{
        setLoading(true);
        setError(null);
        try{
            const response = await fetch(`${url}/clearAll`,{
                method:'DELETE'
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setTasks([]); // clear tasks locally
        }
        catch(err){
            console.log(err);
            setError(err.message);
        }
        finally{
            setLoading(false);
        }
    };

    return(
        <section className="relative grid grid-cols-12 grid-rows-2 gap-1 p-6 mt-16 items-stretch border rounded-lg shadow-lg w-full  bg-white dark:bg-gray-800 justify-center">
            
            <div className="flex flex-col flex-shrink items-stretch lg:col-start-11 sm:col-start-11 sm:col-span-4 md:col-span-8 md:col-start-10">

                <button onClick={addTask} type="button" disabled={!inputValue || loading} className={`focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2    ${!inputValue ? "bg-gray-400 cursor-not-allowed" : "bg-gray-700 hover:bg-red-800 cursor-pointer"} focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900`}>
                    {loading ? 'Loading...' : 'Add a task'}
                </button>

                <button onClick={clearAll} type="button" disabled={loading} className="focus:outline-none text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2  mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 cursor-pointer">
                    {loading ? 'Loading...' : 'Clear All'}
                </button>
            </div>
            
            <div className="flex flex-col gap-2 col-start-1 self-start  row-start-1 row-span-2 col-span-8 ">
                <h1 className=" font-bold text-gray-900 dark:text-white mb-4 md:mb-0 lg:text-3xl lg:row-start-1 lg:col-start-1 lg:justify-self-start lg:self-start">
                    To Do List
                </h1>
                
                {!inputValue && (
                    <p className="text-red-600 text-sm mt-1">This field is required.</p>
                )}

                {error && (
                    <p className="text-red-600 text-sm mt-1">Error: {error}</p>
                )}

                <input name="input" type="text" value={inputValue} placeholder=" Type here" className="bg-gray-200 ml-3 p-2 rounded" onChange={(e) => setInputValue(e.target.value)}></input>
                
                <ul className="relative flex flex-col items-stretch gap-2 ml-3 p-2 ">
                    {loading && <li className="text-gray-500">Loading tasks...</li>}

                    {!loading && tasks.length > 0 ? (tasks.map(task => (
                        <li key={task._id} className="flex flex-row gap-4 justify-around self-start" >
                            {task.completed ? (
                                <div className="line-through"><strong>Task: </strong> {task.text}</div>
                            ) : (
                                <div><strong>Task: </strong> {task.text}</div>
                            )}
                            <input type="checkbox" value={task._id} onChange={toggleComplete}></input>
                        </li>
                    ))) : (!loading && (
                        <li className="absolute text-lg font-bold">
                            There isn't any task added yet.
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default ToDoList;
