import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Route, BrowserRouter, Routes,Link } from 'react-router-dom'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import UserManagment from './pages/admin/UserManagment'
import ContentAdmin from './pages/admin/ContentAdmin'


function App() {
  const [navigation, setCount] = useState(0)
  

  return (
    
    <BrowserRouter>
     <header className="bg-white shadow items-center">
        <nav className="inline-flex   p-4 lg:px-6">
            <ul className='flex  space-around gap-4  font-medium '>
                <Link to="/">Dashboard</Link>
                <Link to="/userManagment">User Managment</Link>
                <Link to="/Content">Content</Link>
            </ul>
        </nav>
        </header>

     <p className='text-red-500 mt-2'> Hello bruv </p>
      <p></p>

         <Routes>
            <Route path="/" element= {<DashboardAdmin/>}/>
            <Route path="/userManagment" element= {<UserManagment/>}/>
            <Route path="/Content" element= {<ContentAdmin/>}/>
        </Routes>
     
     </BrowserRouter>
  
  )
}

export default App
