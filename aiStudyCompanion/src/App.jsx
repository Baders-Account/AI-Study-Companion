import React,{ useState, useContext } from 'react'
import './App.css'

import { Route, BrowserRouter, Routes } from 'react-router-dom'

// Common & main components
import NavBar from './components/NavBar.jsx'
import CourseContext, { CoursesContext } from './pages/student/studentComponents/CourseContext.jsx'
import AboutContent from './pages/About/AboutContent.jsx'
import CoursesPage from './pages/student/CoursesPage.jsx'
import StudentDashboard from './pages/student/StudentDashboard.jsx'

// Instructor pages
import InstructorDashboard from './pages/instructor/InstructorDashboard.jsx'
import CreateQuiz from './pages/instructor/actions/CreateQuiz.jsx'
import UploadMaterial from './pages/instructor/actions/UploadMaterial.jsx'

// Admin pages
import AdminActionPage from './pages/admin/AdminActionPage.jsx'
import DashboardSection from './pages/commonPages/DashboardSection.jsx'
import FooterSection from './pages/commonPages/FooterSection.jsx'
import HeaderSection from './pages/commonPages/HeaderSection.jsx'

// Other pages
import ProfilePage from './pages/Profile/ProfilePage.jsx'
import LoginSignup from './pages/auth/LoginSignup.jsx'

export const ShowContext = React.createContext();

function App() {
  const [showAllCourses, setShowAllCourses] = useState(false)
  const sharedCourses = useContext(CoursesContext)

  return (
    <CourseContext>
      <ShowContext.Provider value={{ showAllCourses, setShowAllCourses }}>
        <BrowserRouter>
          <NavBar />

          <Routes>

            {/* Auth */}
            <Route path="/" element={<LoginSignup />} />
            <Route path="/login" element={<LoginSignup />} />

            {/* Student */}
            <Route path="/Dashboard" element={<StudentDashboard/>} />
            <Route path="/courses/:courseName" element={<CoursesPage />} />

            {/* Instructor */}
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="/instructor/create-quiz" element={<CreateQuiz />} />
            <Route path="/instructor/upload-material" element={<UploadMaterial />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminActionPage />} />

            {/* Common Pages */}
            <Route path="/About" element={<AboutContent />} />
            <Route path="/Profile" element={<ProfilePage />} />

          </Routes>
        </BrowserRouter>
      </ShowContext.Provider>
    </CourseContext>
  )
}

export default App
