

function ActionCard(){

    return(
       <section className="relative grid grid-cols-2 grid-rows-3 md:flex-shrink p-6 mt-16 md:gap-4 border rounded-lg shadow-lg w-full min-h-64 bg-white dark:bg-gray-800 justify-center lg:gap-6">

  
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4   md:mb-0 md:absolute md:top-5 md:left-4 lg:absolute lg:top-5 lg:left-4">
    Actions
  </h1>
  
  <section className="flex sm:flex-col md:flex-row flex-shrink justify-center row-start-2 md:justify-around items-center w-full gap-3 md:gap-4  lg:flex-row">
    <button 
      type="button" 
      className="w-full md:w-auto focus:outline-none text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 cursor-pointer transition-colors duration-200"
    >
      Create Note
    </button>

    <button 
      type="button" 
      className="w-full md:w-auto focus:outline-none text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 cursor-pointer transition-colors duration-200"
    >
      View Notes
    </button>
        </section>

    <section className="flex sm:flex-col md:flex-row flex-shrink justify-center row-start-3 md:justify-around items-center w-full gap-3 md:gap-4  lg:flex-row">

    <button 
      type="button" 
      className="w-full md:w-auto focus:outline-none text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 cursor-pointer transition-colors duration-200"
    >
      AI Assistant
    </button>

    <button 
      type="button" 
      className="w-full md:w-auto focus:outline-none text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 cursor-pointer transition-colors duration-200"
    >
      View Quizzes
    </button>

    </section>

</section>
        
    )

}

export default ActionCard;