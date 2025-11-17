
import { NavLink } from 'react-router-dom';

function AdminNavBar() {
    return (
        

            // bg-green-600  

            <section className='block  '>
            <header className="flex  shadow-md mb-8 mt-0 bg-gray-900   ">
        <nav className="flex justify-center mt-2 mb-4 ml-8 ">
           
                {/* isActive checks what route is the page in and style it*/}

                <NavLink to="/" aria-current="page" className="rounded-md bg-gray-500 px-3 py-2 text-sm font-medium text-white ml-4  hover:bg-white/5 hover:text-white"
                >Dashboard
                </NavLink>

                <NavLink to="/userManagement" className="rounded-md bg-gray-500 px-3 py-2 text-sm font-medium text-white ml-4  hover:bg-white/5 hover:text-white"
                >User Management</NavLink>
                <NavLink to="/Profile" className="rounded-md bg-gray-500 px-3 py-2 text-sm font-medium text-white ml-4  hover:bg-white/5 hover:text-white"
                >Profile</NavLink>
            
        </nav>
        </header>

                </section>
    );
}

export default AdminNavBar;