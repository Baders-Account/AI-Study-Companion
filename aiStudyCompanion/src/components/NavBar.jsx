import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function NavBar() {
        const { isAuthenticated, logout, isInstructor } = useAuth();
        const navigate = useNavigate();

        const handleLogout = () => {
                logout();
                navigate('/login');
        };

        const getDashboardLink = () => {
                return isInstructor ? '/instructor' : '/Dashboard';
        };

        return (
                <section className='fixed w-full z-20 top-0 start-0 end-0 mb-8 block'>
                        <header className="flex flex-wrap shadow-md mt-0 bg-gray-900 justify-between items-center px-8 py-2">
                                <nav className="flex flex-wrap items-center">
                                        {/* Brand/Home Link */}
                                        <NavLink to="/" className="text-white font-bold text-xl mr-6">
                                                AI Study Companion
                                        </NavLink>

                                        {isAuthenticated && (
                                                <>
                                                        <NavLink
                                                                to={getDashboardLink()}
                                                                className={({ isActive }) =>
                                                                        `rounded-md px-3 py-2 text-sm font-medium ml-4 transition-colors ${isActive ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                                                                        }`
                                                                }
                                                        >
                                                                Dashboard
                                                        </NavLink>

                                                        <NavLink
                                                                to="/Profile"
                                                                className={({ isActive }) =>
                                                                        `rounded-md px-3 py-2 text-sm font-medium ml-4 transition-colors ${isActive ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                                                                        }`
                                                                }
                                                        >
                                                                Profile
                                                        </NavLink>
                                                </>
                                        )}

                                        <NavLink
                                                to="/About"
                                                className={({ isActive }) =>
                                                        `rounded-md px-3 py-2 text-sm font-medium ml-4 transition-colors ${isActive ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                                                        }`
                                                }
                                        >
                                                About
                                        </NavLink>
                                </nav>

                                <div className="flex items-center">
                                        {isAuthenticated ? (
                                                <button
                                                        onClick={handleLogout}
                                                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 ml-4 transition-colors cursor-pointer"
                                                >
                                                        Logout
                                                </button>
                                        ) : (
                                                <NavLink
                                                        to="/login"
                                                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 ml-4 transition-colors"
                                                >
                                                        Login
                                                </NavLink>
                                        )}
                                </div>
                        </header>
                </section>
        );
}

export default NavBar;