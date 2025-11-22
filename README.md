AI Study Companion

 Project Description
 
   The AI Study Companion is a web-based platform designed to simplify student life by unifying study
   tools like notes, flashcards, quizzes, and progress tracking in one place. Instead of bouncing between
   apps for notes and deadlines, everything is organized on a single platform.
   It features an intelligent AI assistant (currently a front-end demo) that aims to summarize notes,
   generate quizzes, and create personalized study plans to help students focus on their weak areas. The
   platform promotes collaboration and aims to make studying organized, efficient, and less stressful for
   both students and educators.

----------------------------------------------------------------------------------------------------------------
 
 Key Roles
 
   1- Student: Can access course materials, create notes, generate quizzes, manage to-do lists, and
   track progress.
   
   2- Instructor: Can create courses, upload study materials (notes, PDFs), create quizzes, and monitor
   student progress.
   
   3-Admin: Manages user accounts, content, and system settings.

----------------------------------------------------------------------------------------------------------------
   
 Team Members (Team 6 SWE363-03)
 
   Bader Almutairi - s202159390
   
   Faisal Alharbi - s202261000
   
   Alwaleed Alharthi - s202158850
   
   Muath Alzahrani - s202161950

   ----------------------------------------------------------------------------------------------------------------

 Setup and Installation
 
   To set up the project locally, follow these steps:
   
   1. Prerequisites: Ensure you have Node.js and npm installed on your machine.
   
   2. Clone the repository (or extract the project files):
   git clone <repository-url>
   cd aistudycompanion
   
  3. Install Dependencies: Run the following command to install the required packages listed in
   package.json :
   npm install
   
   4. Run the Development Server: Start the Vite development server:
   npm run dev
   
   5. Access the App: Open your browser and navigate to the URL provided in the terminal (usually
   http://localhost:5173 ).

   ----------------------------------------------------------------------------------------------------------------

 Usage Instructions and Examples
 
   Authentication (Demo Credentials)
   
   The application uses hardcoded demo credentials for login purposes. You can use the following
   accounts to explore the different dashboards:
   
   Student Login:
   
   Username: student
   
   Password: 123
   
   Instructor Login:
   
   Username: instructor
   
   Password: 123

   admin Login:
   
   Username: admin
   
   Password: 123

------------------------------------------------------------------------------------------------------------------
   
 Student Features
 
   1. Dashboard: Upon logging in, you will see the Student Dashboard containing a To-Do List, Courses
   overview, and Progress tracking.
   
   2. Manage Courses:
   
   Type a course name in the "Courses" widget and click "Add a course".
   Click "View Courses" to see a popup of all enrolled courses.
   Click on a specific course card (e.g., "Data Structures") to enter the Course Page.
   
 3. Course Page Tools:
 
   Create/View Notes: Add links to external study resources or view existing ones.
   AI Assistant: Type a prompt (e.g., "Explain React hooks") to see a demo response from the
   AI.
   View Quizzes: Access quizzes relevant to the course topics.

   ----------------------------------------------------------------------------------------------------------------
   
 Instructor Features:
 
    1- Dashboard: Log in as an instructor to access the Instructor Dashboard.
    2= Actions:
    
   Create Quiz: Navigate to the quiz creation form to set up new assessments for a specific
   course.
   
   Upload Material: Upload lecture notes or links for students to access.
   
   Create Course: Initialize new courses for the semester

   ----------------------------------------------------------------------------------------------------------------
  
