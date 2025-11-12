import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Route, BrowserRouter, Routes,Link } from 'react-router-dom'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import UserManagment from './pages/admin/UserManagment'
import ContentAdmin from './pages/admin/ContentAdmin'
import NavBar from './components/NavBar.jsx'
import AdminNavBar from './components/AdminNavBar.jsx'


function App() {
  const [navigation, setCount] = useState(0)
  

  return (
    
    <BrowserRouter>
    <AdminNavBar/>

     

         <Routes>
            <Route path="/" element= {<DashboardAdmin/>}/>
            <Route path="/userManagement" element= {<UserManagment/>}/>
            <Route path="/Content" element= {<ContentAdmin/>}/>
        </Routes>
     
     </BrowserRouter>
  
  )
}

export default App
