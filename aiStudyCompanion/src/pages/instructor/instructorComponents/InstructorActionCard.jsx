


function InstructorActionCard(){

    return(
       <section className="relative grid grid-cols-2 grid-rows-3 md:flex-shrink p-6 mt-16 md:gap-4 border rounded-lg shadow-lg w-full min-h-64 bg-white dark:bg-gray-800 justify-center lg:gap-6">


  <h1 className=" font-bold text-gray-900 dark:text-white mb-4   md:mb-0 lg:text-3xl lg:row-start-1 lg:col-start-1 lg:justify-self-start lg:self-center">
    Action
  </h1>

  <section className="flex sm:flex-col md:flex-row flex-shrink justify-center row-start-2 md:justify-around items-center w-full gap-3 md:gap-4  lg:flex-row">
    <button
      type="button"
      className="w-full md:w-auto focus:outline-none text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 cursor-pointer transition-colors duration-200"
    >
      Create Quiz
    </button>

    <button
      type="button"
      className="w-full md:w-auto focus:outline-none text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 cursor-pointer transition-colors duration-200"
    >
      Create Course
    </button>
        </section>

    <section className="flex sm:flex-col md:flex-row flex-shrink justify-center lg:row-start-2 lg:col-start-2  md:justify-around items-center w-full gap-3 md:gap-4  lg:flex-row">

    <button
      type="button"
      className="w-full md:w-auto focus:outline-none text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 cursor-pointer transition-colors duration-200"
    >
      Upload Material
    </button>

    </section>

</section>

    )

}

export default InstructorActionCard;
