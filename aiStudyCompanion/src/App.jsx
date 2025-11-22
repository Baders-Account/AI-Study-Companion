// App.jsx
import React,{ useState } from 'react'
import './App.css'
import { Route, BrowserRouter, Routes} from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import StudentDashboard from './pages/student/StudentDashboard.jsx'
import InstructorDashboard from './pages/instructor/InstructorDashboard.jsx'
import CoursesPage from './pages/student/CoursesPage.jsx'
import AboutContent from './pages/About/AboutContent.jsx'
import CourseContext from './pages/student/studentComponents/CourseContext.jsx'
import { CoursesContext } from './pages/student/studentComponents/CourseContext.jsx'
import LoginSignup from './pages/auth/LoginSignup.jsx'
import CreateQuiz from './pages/instructor/actions/CreateQuiz.jsx'
import UploadMaterial from './pages/instructor/actions/UploadMaterial.jsx'


export const ShowContext = React.createContext();

function App() {
  const [showAllCourses, setShowAllCourses] = useState(false)

  return (
    <CourseContext>
      <ShowContext.Provider value={{ showAllCourses, setShowAllCourses }}>
        <BrowserRouter>
          <NavBar />
          <Routes>
            
            <Route path="/" element={<LoginSignup />} />

            
            <Route path="/Dashboard" element={<StudentDashboard/>} />
            <Route path="/instructor" element={<InstructorDashboard />} />

            
            <Route path="/courses/:courseName" element={<CoursesPage />} />
            <Route path="/About" element={<AboutContent />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/instructor/create-quiz" element={<CreateQuiz />} />
            <Route path="/instructor/upload-material" element={<UploadMaterial />} />

          </Routes>
        </BrowserRouter>
      </ShowContext.Provider>
    </CourseContext>
  )
}

export default App
