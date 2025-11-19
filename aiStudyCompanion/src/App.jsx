import { useState } from 'react'

import './App.css'

import { Route, BrowserRouter, Routes} from 'react-router-dom'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import UserManagment from './pages/admin/UserManagment'
import ContentAdmin from './pages/admin/ContentAdmin'
import NavBar from './components/NavBar.jsx'
import AdminNavBar from './components/AdminNavBar.jsx'
import DashboardSection from './pages/commonPages/DashboardSection.jsx'
import FooterSection from './pages/commonPages/FooterSection.jsx'
import HeaderSection from './pages/commonPages/HeaderSection.jsx'
import StudentDashboard from './pages/student/StudentDashboard.jsx'
import { ShowContext } from './pages/student/studentComponents/Courses.jsx'
import CourseContext from './pages/student/studentComponents/CourseContext.jsx'
import AboutContent from './pages/About/AboutContent.jsx'

function App() {
  const [showAllCourses, setShowAllCourses] = useState(false)
  

  return (
        <CourseContext>
         <ShowContext.Provider value={{ showAllCourses, setShowAllCourses }}>

    <BrowserRouter>
    <NavBar/>
         <Routes>
            <Route path="/" element= {<StudentDashboard/>}/>
            <Route path="/Dashboard" element= {<StudentDashboard/>}/>
            <Route path="/About" element= {<UserManagment/>}/>
            <Route path="/Profile" element= {<ContentAdmin/>}/>
        </Routes>
     
     </BrowserRouter>
              </ShowContext.Provider>
              </CourseContext>
    
     

  
  )
}

export default App
