# AI Study Companion – Back-End

This is the Node.js / Express back-end for the AI Study Companion app.  
It exposes REST APIs for:

- User authentication (students & instructors)
- Courses & enrollments
- Quizzes (including AI-generated quizzes)
- Materials & notes
- To-do tasks
- Simple “Create & View” notes

---

## 1. Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB (e.g. MongoDB Atlas)
- **Auth:** bcrypt for password hashing
- **AI:** OpenAI API
- **Deployment:** Compatible with Vercel serverless functions

---

## 2. Prerequisites

Before you run the back-end you will need:

- **Node.js** (v18 or newer)
- **npm** (comes with Node)
- **MongoDB**:
  - Either a local MongoDB instance, or
  - A MongoDB Atlas connection string
- **OpenAI API key** for AI quiz generation

---

## 3. Environment Variables

the **.env** file containing the keys

---

## 4. Installation & Running Locally

# Clone the repository

- git clone <your-repo-url>
- cd <your-repo-folder>

# Install dependencies

- npm install / npm i
---

## 5. Run the server in development

-  default (from project root)
-  node index.js
---