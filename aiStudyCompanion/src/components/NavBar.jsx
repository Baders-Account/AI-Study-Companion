
import { NavLink } from 'react-router-dom';

function NavBar() {
    return (
        

            // bg-green-600  

            <section className='fixed w-full z-1 top-0 start-0 end-0 mb-8  block'>
            <header className="flex flex-wrap shadow-md mt-0 bg-gray-900   ">
        <nav className="flex flex-wrap  mt-2 mb-4 ml-8 ">
           
                {/* isActive checks what route is the page in and style it*/}


                {/* */}
                <NavLink to="/" aria-current="page" 
                >
                </NavLink>

                <NavLink to="/Dashboard" className="rounded-md bg-gray-500 px-3 py-2 text-sm font-medium text-white ml-4  hover:bg-white/5 hover:text-white"
                >Dashboard</NavLink>

                <NavLink to="/About" className="rounded-md bg-gray-500 px-3 py-2 text-sm font-medium text-white ml-4  hover:bg-white/5 hover:text-white"
                >About</NavLink>

                <NavLink to="/Profile" className="rounded-md bg-gray-500 px-3 py-2 text-sm font-medium text-white ml-4  hover:bg-white/5 hover:text-white"
                >Profile</NavLink>
            
        </nav>
        </header>

                </section>
    );
}

export default NavBar;