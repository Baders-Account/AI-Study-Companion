

function ActionCard(){

    return(
        <section className="relative flex flex-col  justify-between p-6 mt-15  border rounded-lg shadow-lg w-full min-h-64">

        <h1 className="absolute top-2 left-3 text-2xl font-bold">Action</h1>
        
        <section className="flex flex-grow border justify-between  min-h-20">
        
        <button>Create Note</button>
        <button>View Notes</button>
        <button>AI Assistant</button>
        <button>View Quizzes</button>
        </section>

        </section>
        
    )

}

export default ActionCard;