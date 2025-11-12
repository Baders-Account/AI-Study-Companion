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
import DashboardSection from './pages/commonPages/DashboardSection.jsx'
import FooterSection from './pages/commonPages/FooterSection.jsx'
import HeaderSection from './pages/commonPages/HeaderSection.jsx'

function App() {
  const [navigation, setCount] = useState(0)
  

  return (
    
    <BrowserRouter>
    <AdminNavBar/>
    <HeaderSection/>
    <DashboardSection/>
    <FooterSection webName="AI Study Companion" year="2025" links="https://www.figma.com/design/bt54BoXWBEy8aAx8eTb3cz/Phase-3?node-id=0-1&p=f&t=PGT5ZxiyApEmWMfO-0"/>

     

         <Routes>
            <Route path="/" element= {<DashboardAdmin/>}/>
            <Route path="/userManagement" element= {<UserManagment/>}/>
            <Route path="/Content" element= {<ContentAdmin/>}/>
        </Routes>
     
     </BrowserRouter>
  
  )
}

export default App
