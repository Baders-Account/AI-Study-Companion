

function AuditLogs() {
        return(
            <>
            <header className="flex flex-row  ml-8 p-6 mt-6 mb-6 border rounded-lg shadow-lg w-full max-w-md">
                <h1 className="w-full">Audit Logs Panel</h1>
                <section className="flex flex-col p-2">
                
                <label htmlFor="date">Filter by Date</label>
                    <select name="date" id="date" className="p-2 border border-gray-300 rounded-md shadow-sm">
                         {/* it should be a list */ }
                        <option className=""> latest</option>
                        <option className="">oldest</option>
                    </select>
                </section>

                <section className="flex flex-col p-2">
                  <label htmlFor="action">Action Type </label>
                    <select name="action" id="action" className="p-2 border border-gray-300 rounded-md shadow-sm">
                        {/* it should be a list */ }
                        <option className=""> Content Upload</option>
                        <option className="">User Login</option>
                    </select>

                </section>




                
            </header>
            <section></section>
            
            </>
        )
}


export default AuditLogs;