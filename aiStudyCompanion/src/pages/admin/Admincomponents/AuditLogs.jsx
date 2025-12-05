

function AuditLogs() {
        return(
            <>
            <header className="flex flex-row  ml-8 p-6 mt-6 mb-6 border rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-gray-900 font-bold basis-256 p-2 ">Audit Logs Panel</h1>


                





                
                <section className="flex flex-col basis-128 mr-2 ">
                
               
                    <select name="date" id="date" className="p-2 border border-gray-300 rounded-md shadow-sm">
                         {/* it should be a list */ }
                        <option className=""> latest</option>
                        <option className="">oldest</option>
                    </select>
                </section>

                <section className="flex flex-col ">
                 
                    <select name="action" id="action" className="p-2 border border-gray-300 rounded-md shadow-sm">
                        {/* it should be a list */ }
                        <option className=""> Content Upload</option>
                        <option className="">User Login</option>
                    </select>

                </section>
              




                
            </header>
            <section>

                
            </section>
            
            </>
        )
}


export default AuditLogs;