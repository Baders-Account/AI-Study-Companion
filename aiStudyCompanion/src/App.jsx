import React,{ useState } from 'react'

import './App.css'

import { Route, BrowserRouter, Routes} from 'react-router-dom'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import UserManagment from './pages/admin/UserManagment'
import ContentAdmin from './pages/admin/ContentAdmin'
import NavBar from './components/NavBar.jsx'
import AdminNavBar from './components/AdminNavBar.jsx'

import StudentDashboard from './pages/student/StudentDashboard.jsx'

import CourseContext from './pages/student/studentComponents/CourseContext.jsx'
import AboutContent from './pages/About/AboutContent.jsx'
import { useContext } from 'react'
import CoursesPage from './pages/student/CoursesPage.jsx'
import {CoursesContext} from './pages/student/studentComponents/CourseContext.jsx'

export const ShowContext = React.createContext();
function App() {
  const [showAllCourses, setShowAllCourses] = useState(false)
  const sharedCourses = useContext(CoursesContext)
  

  
  

  return (
        <CourseContext>
         <ShowContext.Provider value={{ showAllCourses, setShowAllCourses }}>

    <BrowserRouter>
    <NavBar/>
         <Routes>
            <Route path="/" element= {<StudentDashboard/>}/>
            <Route path="/Dashboard" element= {<StudentDashboard/>}/>
            <Route path="/courses/:courseName" element={<CoursesPage  />}/> 
            
            <Route path="/About" element= {<AboutContent/>}/>
            <Route path="/Profile" element= {<CoursesPage/>}/>

        
        </Routes>
     
     </BrowserRouter>
              </ShowContext.Provider>
              </CourseContext>
    
     

  
  )
}

export default App
