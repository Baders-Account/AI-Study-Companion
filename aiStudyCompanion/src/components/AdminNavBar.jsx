
import { NavLink } from 'react-router-dom';

function AdminNavBar() {
    return (
        

            // bg-green-600  
         <header className="flex inline-block w-full shadow-md mb-8 mt-0 bg-green-600">
        <nav className="flex justify-center mt-2 mb-4 ml-8 ">
           
                {/* isActive checks what route is the page in and style it*/}

                <NavLink to="/" aria-current="page" className="rounded-md bg-green-900 px-3 py-2 text-sm font-medium text-white ml-4  hover:bg-white/5 hover:text-white"
                >Dashboard
                </NavLink>

                <NavLink to="/userManagement" className="rounded-md bg-green-900 px-3 py-2 text-sm font-medium text-white ml-4  hover:bg-white/5 hover:text-white"
                >User Management</NavLink>
                <NavLink to="/Profile" className="rounded-md bg-green-900 px-3 py-2 text-sm font-medium text-white ml-4  hover:bg-white/5 hover:text-white"
                >Profile</NavLink>
            
        </nav>
        </header>
    );
}

export default AdminNavBar;