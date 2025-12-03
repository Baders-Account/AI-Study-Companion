# AI Study Companion - Complete Database Design

## Overview

This document outlines the complete database schema for the AI Study Companion application, including all tables, fields, relationships, and indexes.

**Database Type**: MongoDB (NoSQL)
**Collections**: 11 main collections
**Design Pattern**: Document-based with references

---

## 1. Users Collection

Stores all user accounts (students, instructors, admins).

```javascript
{
    _id: ObjectId,
    username: String,          // Unique username
    email: String,             // Unique email
    passwordHash: String,      // Hashed password (bcrypt)
    role: String,              // "student" | "instructor" | "admin"
    firstName: String,
    lastName: String,
    profilePicture: String,    // URL or base64
    createdAt: Date,
    updatedAt: Date,
    lastLogin: Date,
    isActive: Boolean,         // Account status
    preferences: {
        theme: String,         // "light" | "dark"
        notifications: Boolean,
        language: String
    }
}
```

**Indexes**:
- `username`: unique
- `email`: unique
- `role`: non-unique

**Sample Document**:
```javascript
{
    _id: ObjectId("507f1f77bcf86cd799439011"),
    username: "john_doe",
    email: "john@example.com",
    passwordHash: "$2b$10$...",
    role: "student",
    firstName: "John",
    lastName: "Doe",
    profilePicture: null,
    createdAt: ISODate("2025-01-15T10:00:00Z"),
    updatedAt: ISODate("2025-01-15T10:00:00Z"),
    lastLogin: ISODate("2025-01-15T14:30:00Z"),
    isActive: true,
    preferences: {
        theme: "dark",
        notifications: true,
        language: "en"
    }
}
```

---

## 2. Courses Collection

Stores courses created by instructors.

```javascript
{
    _id: ObjectId,
    courseName: String,
    courseCode: String,        // e.g., "CS101"
    description: String,
    instructorId: ObjectId,    // Reference to Users collection
    instructorName: String,    // Denormalized for quick access
    department: String,        // e.g., "Computer Science"
    semester: String,          // e.g., "Fall 2025"
    credits: Number,
    capacity: Number,          // Max students
    enrolledCount: Number,     // Current enrollment
    status: String,            // "active" | "archived" | "draft"
    syllabus: String,          // Text or URL
    schedule: {
        days: [String],        // ["Monday", "Wednesday"]
        startTime: String,     // "10:00 AM"
        endTime: String,       // "11:30 AM"
        room: String
    },
    tags: [String],            // ["programming", "beginner"]
    createdAt: Date,
    updatedAt: Date,
    startDate: Date,
    endDate: Date
}
```

**Indexes**:
- `instructorId`: non-unique
- `courseCode`: unique
- `status`: non-unique

**Sample Document**:
```javascript
{
    _id: ObjectId("507f191e810c19729de860ea"),
    courseName: "Introduction to Programming",
    courseCode: "CS101",
    description: "Learn the fundamentals of programming using JavaScript",
    instructorId: ObjectId("507f1f77bcf86cd799439012"),
    instructorName: "Dr. Sarah Smith",
    department: "Computer Science",
    semester: "Fall 2025",
    credits: 3,
    capacity: 50,
    enrolledCount: 35,
    status: "active",
    syllabus: "Week 1: Variables and Data Types...",
    schedule: {
        days: ["Monday", "Wednesday", "Friday"],
        startTime: "10:00 AM",
        endTime: "11:30 AM",
        room: "Room 204"
    },
    tags: ["programming", "beginner", "javascript"],
    createdAt: ISODate("2025-01-10T09:00:00Z"),
    updatedAt: ISODate("2025-01-15T12:00:00Z"),
    startDate: ISODate("2025-02-01T00:00:00Z"),
    endDate: ISODate("2025-05-31T00:00:00Z")
}
```

---

## 3. Enrollments Collection

Many-to-many relationship between students and courses.

```javascript
{
    _id: ObjectId,
    studentId: ObjectId,       // Reference to Users collection
    courseId: ObjectId,        // Reference to Courses collection
    enrolledAt: Date,
    status: String,            // "active" | "completed" | "dropped" | "withdrawn"
    grade: String,             // "A", "B+", etc. (null until course ends)
    gradePoints: Number,       // Numerical grade (0-100)
    attendance: Number,        // Percentage (0-100)
    progress: Number,          // Course completion percentage (0-100)
    lastAccessed: Date,
    completedAt: Date          // When student completed the course
}
```

**Indexes**:
- `studentId`: non-unique
- `courseId`: non-unique
- `{studentId, courseId}`: unique compound index

**Sample Document**:
```javascript
{
    _id: ObjectId("507f191e810c19729de860eb"),
    studentId: ObjectId("507f1f77bcf86cd799439011"),
    courseId: ObjectId("507f191e810c19729de860ea"),
    enrolledAt: ISODate("2025-01-15T10:00:00Z"),
    status: "active",
    grade: null,
    gradePoints: 87.5,
    attendance: 95,
    progress: 45,
    lastAccessed: ISODate("2025-01-20T14:30:00Z"),
    completedAt: null
}
```

---

## 4. Materials Collection

Course materials uploaded by instructors (PDFs, videos, etc.).

```javascript
{
    _id: ObjectId,
    courseId: ObjectId,        // Reference to Courses collection
    instructorId: ObjectId,    // Who uploaded it
    title: String,
    description: String,
    type: String,              // "pdf" | "video" | "link" | "document" | "slides"
    fileUrl: String,           // URL or file path
    fileSize: Number,          // In bytes
    fileName: String,
    mimeType: String,          // "application/pdf", "video/mp4", etc.
    week: Number,              // Which week of the course
    topic: String,
    isPublished: Boolean,
    uploadedAt: Date,
    updatedAt: Date,
    viewCount: Number,
    downloadCount: Number
}
```

**Indexes**:
- `courseId`: non-unique
- `instructorId`: non-unique

**Sample Document**:
```javascript
{
    _id: ObjectId("507f191e810c19729de860ec"),
    courseId: ObjectId("507f191e810c19729de860ea"),
    instructorId: ObjectId("507f1f77bcf86cd799439012"),
    title: "Week 1: Introduction to Variables",
    description: "Slides covering variable declarations and data types",
    type: "slides",
    fileUrl: "https://storage.example.com/materials/week1-slides.pdf",
    fileSize: 2048576,
    fileName: "week1-slides.pdf",
    mimeType: "application/pdf",
    week: 1,
    topic: "Variables and Data Types",
    isPublished: true,
    uploadedAt: ISODate("2025-01-10T10:00:00Z"),
    updatedAt: ISODate("2025-01-10T10:00:00Z"),
    viewCount: 35,
    downloadCount: 28
}
```

---

## 5. Quizzes Collection

Quizzes created by instructors for courses.

```javascript
{
    _id: ObjectId,
    courseId: ObjectId,        // Reference to Courses collection
    instructorId: ObjectId,    // Who created it
    title: String,
    description: String,
    instructions: String,
    type: String,              // "practice" | "graded" | "midterm" | "final"
    totalPoints: Number,
    passingScore: Number,      // Minimum score to pass
    duration: Number,          // Time limit in minutes (null = unlimited)
    availableFrom: Date,
    availableTo: Date,
    allowMultipleAttempts: Boolean,
    maxAttempts: Number,       // null = unlimited
    showCorrectAnswers: Boolean,
    showScoreImmediately: Boolean,
    randomizeQuestions: Boolean,
    randomizeOptions: Boolean,
    isPublished: Boolean,
    createdAt: Date,
    updatedAt: Date
}
```

**Indexes**:
- `courseId`: non-unique
- `instructorId`: non-unique

**Sample Document**:
```javascript
{
    _id: ObjectId("507f191e810c19729de860ed"),
    courseId: ObjectId("507f191e810c19729de860ea"),
    instructorId: ObjectId("507f1f77bcf86cd799439012"),
    title: "Week 1 Quiz: Variables and Data Types",
    description: "Test your understanding of variables",
    instructions: "Answer all questions. You have 30 minutes.",
    type: "graded",
    totalPoints: 100,
    passingScore: 70,
    duration: 30,
    availableFrom: ISODate("2025-02-05T00:00:00Z"),
    availableTo: ISODate("2025-02-12T23:59:59Z"),
    allowMultipleAttempts: true,
    maxAttempts: 3,
    showCorrectAnswers: true,
    showScoreImmediately: true,
    randomizeQuestions: false,
    randomizeOptions: true,
    isPublished: true,
    createdAt: ISODate("2025-01-20T10:00:00Z"),
    updatedAt: ISODate("2025-01-20T10:00:00Z")
}
```

---

## 6. Questions Collection

Questions for quizzes.

```javascript
{
    _id: ObjectId,
    quizId: ObjectId,          // Reference to Quizzes collection
    questionText: String,
    questionType: String,      // "multiple_choice" | "true_false" | "short_answer" | "essay"
    points: Number,
    order: Number,             // Question order in quiz
    options: [
        {
            optionId: String,  // "A", "B", "C", "D"
            text: String,
            isCorrect: Boolean
        }
    ],
    correctAnswer: String,     // For short_answer type
    explanation: String,       // Shown after answering
    hints: [String],
    media: {
        type: String,          // "image" | "video" | "code"
        url: String
    },
    createdAt: Date
}
```

**Indexes**:
- `quizId`: non-unique

**Sample Document**:
```javascript
{
    _id: ObjectId("507f191e810c19729de860ee"),
    quizId: ObjectId("507f191e810c19729de860ed"),
    questionText: "What keyword is used to declare a constant in JavaScript?",
    questionType: "multiple_choice",
    points: 10,
    order: 1,
    options: [
        { optionId: "A", text: "var", isCorrect: false },
        { optionId: "B", text: "let", isCorrect: false },
        { optionId: "C", text: "const", isCorrect: true },
        { optionId: "D", text: "constant", isCorrect: false }
    ],
    correctAnswer: null,
    explanation: "The 'const' keyword is used to declare constants in JavaScript.",
    hints: ["Think about immutable variables"],
    media: null,
    createdAt: ISODate("2025-01-20T10:15:00Z")
}
```

---

## 7. Quiz Attempts Collection

Student attempts on quizzes.

```javascript
{
    _id: ObjectId,
    quizId: ObjectId,          // Reference to Quizzes collection
    studentId: ObjectId,       // Reference to Users collection
    attemptNumber: Number,     // 1, 2, 3, etc.
    status: String,            // "in_progress" | "submitted" | "graded"
    startedAt: Date,
    submittedAt: Date,
    timeSpent: Number,         // In seconds
    score: Number,             // Points earned
    percentage: Number,        // Score percentage
    passed: Boolean,
    answers: [
        {
            questionId: ObjectId,
            answer: String,    // Selected option or text answer
            isCorrect: Boolean,
            pointsEarned: Number,
            timeSpent: Number  // Time spent on this question
        }
    ],
    feedback: String,          // Instructor feedback (optional)
    gradedAt: Date,
    gradedBy: ObjectId         // Instructor who graded (for essays)
}
```

**Indexes**:
- `quizId`: non-unique
- `studentId`: non-unique
- `{studentId, quizId}`: compound index

**Sample Document**:
```javascript
{
    _id: ObjectId("507f191e810c19729de860ef"),
    quizId: ObjectId("507f191e810c19729de860ed"),
    studentId: ObjectId("507f1f77bcf86cd799439011"),
    attemptNumber: 1,
    status: "submitted",
    startedAt: ISODate("2025-02-06T14:00:00Z"),
    submittedAt: ISODate("2025-02-06T14:25:00Z"),
    timeSpent: 1500,
    score: 85,
    percentage: 85,
    passed: true,
    answers: [
        {
            questionId: ObjectId("507f191e810c19729de860ee"),
            answer: "C",
            isCorrect: true,
            pointsEarned: 10,
            timeSpent: 45
        }
    ],
    feedback: null,
    gradedAt: ISODate("2025-02-06T14:25:00Z"),
    gradedBy: null
}
```

---

## 8. Notes Collection

Student notes for courses.

```javascript
{
    _id: ObjectId,
    studentId: ObjectId,       // Reference to Users collection
    courseId: ObjectId,        // Reference to Courses collection
    title: String,
    content: String,           // Rich text (HTML or Markdown)
    tags: [String],
    color: String,             // For visual organization
    isPinned: Boolean,
    isShared: Boolean,         // Can other students see it?
    createdAt: Date,
    updatedAt: Date,
    lastViewedAt: Date,
    relatedMaterialId: ObjectId // Optional: link to material
}
```

**Indexes**:
- `studentId`: non-unique
- `courseId`: non-unique

**Sample Document**:
```javascript
{
    _id: ObjectId("507f191e810c19729de860f0"),
    studentId: ObjectId("507f1f77bcf86cd799439011"),
    courseId: ObjectId("507f191e810c19729de860ea"),
    title: "Variables in JavaScript",
    content: "# Variables\n\n- var: function-scoped\n- let: block-scoped\n- const: block-scoped, immutable",
    tags: ["variables", "javascript", "week1"],
    color: "#FFE5B4",
    isPinned: true,
    isShared: false,
    createdAt: ISODate("2025-02-01T15:00:00Z"),
    updatedAt: ISODate("2025-02-03T10:30:00Z"),
    lastViewedAt: ISODate("2025-02-05T09:00:00Z"),
    relatedMaterialId: ObjectId("507f191e810c19729de860ec")
}
```

---

## 9. Flashcards Collection

Flashcards created by students for studying.

```javascript
{
    _id: ObjectId,
    studentId: ObjectId,       // Reference to Users collection
    courseId: ObjectId,        // Reference to Courses collection (optional)
    deckName: String,
    question: String,          // Front of card
    answer: String,            // Back of card
    difficulty: String,        // "easy" | "medium" | "hard"
    tags: [String],
    timesReviewed: Number,
    correctCount: Number,
    incorrectCount: Number,
    lastReviewedAt: Date,
    nextReviewAt: Date,        // Spaced repetition
    confidence: Number,        // 1-5 rating
    createdAt: Date,
    updatedAt: Date,
    isShared: Boolean
}
```

**Indexes**:
- `studentId`: non-unique
- `courseId`: non-unique
- `nextReviewAt`: non-unique (for spaced repetition)

**Sample Document**:
```javascript
{
    _id: ObjectId("507f191e810c19729de860f1"),
    studentId: ObjectId("507f1f77bcf86cd799439011"),
    courseId: ObjectId("507f191e810c19729de860ea"),
    deckName: "JavaScript Basics",
    question: "What is the difference between let and const?",
    answer: "let allows reassignment, const does not allow reassignment",
    difficulty: "medium",
    tags: ["javascript", "variables"],
    timesReviewed: 5,
    correctCount: 4,
    incorrectCount: 1,
    lastReviewedAt: ISODate("2025-02-10T18:00:00Z"),
    nextReviewAt: ISODate("2025-02-13T18:00:00Z"),
    confidence: 4,
    createdAt: ISODate("2025-02-01T16:00:00Z"),
    updatedAt: ISODate("2025-02-10T18:00:00Z"),
    isShared: false
}
```

---

## 10. Tasks (ToDo) Collection

Personal tasks/to-do items for students.

```javascript
{
    _id: ObjectId,
    studentId: ObjectId,       // Reference to Users collection
    courseId: ObjectId,        // Reference to Courses collection (optional)
    title: String,
    description: String,
    dueDate: Date,
    priority: String,          // "low" | "medium" | "high" | "urgent"
    status: String,            // "pending" | "in_progress" | "completed" | "cancelled"
    isCompleted: Boolean,
    completedAt: Date,
    tags: [String],
    reminderAt: Date,
    estimatedDuration: Number, // In minutes
    actualDuration: Number,    // In minutes
    createdAt: Date,
    updatedAt: Date
}
```

**Indexes**:
- `studentId`: non-unique
- `courseId`: non-unique
- `dueDate`: non-unique

**Sample Document**:
```javascript
{
    _id: ObjectId("507f191e810c19729de860f2"),
    studentId: ObjectId("507f1f77bcf86cd799439011"),
    courseId: ObjectId("507f191e810c19729de860ea"),
    title: "Complete Week 1 Quiz",
    description: "Finish the variables and data types quiz before deadline",
    dueDate: ISODate("2025-02-12T23:59:59Z"),
    priority: "high",
    status: "completed",
    isCompleted: true,
    completedAt: ISODate("2025-02-06T14:30:00Z"),
    tags: ["quiz", "week1"],
    reminderAt: ISODate("2025-02-12T18:00:00Z"),
    estimatedDuration: 30,
    actualDuration: 25,
    createdAt: ISODate("2025-02-05T09:00:00Z"),
    updatedAt: ISODate("2025-02-06T14:30:00Z")
}
```

---

## 11. Progress Tracking Collection

Tracks student progress across courses.

```javascript
{
    _id: ObjectId,
    studentId: ObjectId,       // Reference to Users collection
    courseId: ObjectId,        // Reference to Courses collection
    date: Date,                // Date of this progress snapshot
    materialsViewed: Number,   // Count of materials viewed
    quizzesCompleted: Number,
    averageQuizScore: Number,
    timeSpent: Number,         // Total minutes spent
    notesCreated: Number,
    flashcardsCreated: Number,
    flashcardsReviewed: Number,
    tasksCompleted: Number,
    weeklyGoalMet: Boolean,
    streak: Number,            // Consecutive days active
    lastActivityAt: Date
}
```

**Indexes**:
- `studentId`: non-unique
- `courseId`: non-unique
- `date`: non-unique
- `{studentId, courseId, date}`: unique compound index

**Sample Document**:
```javascript
{
    _id: ObjectId("507f191e810c19729de860f3"),
    studentId: ObjectId("507f1f77bcf86cd799439011"),
    courseId: ObjectId("507f191e810c19729de860ea"),
    date: ISODate("2025-02-06T00:00:00Z"),
    materialsViewed: 3,
    quizzesCompleted: 1,
    averageQuizScore: 85,
    timeSpent: 120,
    notesCreated: 2,
    flashcardsCreated: 5,
    flashcardsReviewed: 10,
    tasksCompleted: 3,
    weeklyGoalMet: true,
    streak: 7,
    lastActivityAt: ISODate("2025-02-06T18:30:00Z")
}
```

---

## Entity Relationship Diagram

```
┌─────────────┐
│    Users    │
│  (students, │
│ instructors,│
│   admins)   │
└──────┬──────┘
       │
       │ 1:N (instructor creates courses)
       ├─────────────────────────┐
       │                         │
       ▼                         ▼
┌─────────────┐           ┌─────────────┐
│   Courses   │           │ Enrollments │◄─┐
└──────┬──────┘           └──────┬──────┘  │
       │                         │         │
       │ 1:N                     │ N:1     │
       ├─────────────────┬───────┘         │
       │                 │                 │ N:1
       ▼                 ▼                 │
┌─────────────┐   ┌─────────────┐         │
│  Materials  │   │   Quizzes   │         │
└─────────────┘   └──────┬──────┘         │
                         │                │
                         │ 1:N            │
                         ▼                │
                  ┌─────────────┐         │
                  │  Questions  │         │
                  └─────────────┘         │
                                          │
       ┌──────────────────────────────────┘
       │
       │ (student creates)
       ├─────────────────────┬────────────────┬─────────────────┐
       ▼                     ▼                ▼                 ▼
┌─────────────┐      ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│    Notes    │      │  Flashcards │  │    Tasks    │  │Quiz Attempts│
└─────────────┘      └─────────────┘  └─────────────┘  └─────────────┘
       │                     │                │                │
       └─────────────────────┴────────────────┴────────────────┘
                             │
                             ▼
                      ┌─────────────┐
                      │  Progress   │
                      │  Tracking   │
                      └─────────────┘
```

---

## Relationships Summary

| Parent | Child | Relationship | Notes |
|--------|-------|--------------|-------|
| Users (instructor) | Courses | 1:N | Instructor creates many courses |
| Users (student) | Enrollments | 1:N | Student enrolls in many courses |
| Courses | Enrollments | 1:N | Course has many enrolled students |
| Courses | Materials | 1:N | Course has many materials |
| Courses | Quizzes | 1:N | Course has many quizzes |
| Quizzes | Questions | 1:N | Quiz has many questions |
| Quizzes | Quiz Attempts | 1:N | Quiz has many student attempts |
| Users (student) | Quiz Attempts | 1:N | Student has many quiz attempts |
| Users (student) | Notes | 1:N | Student creates many notes |
| Users (student) | Flashcards | 1:N | Student creates many flashcards |
| Users (student) | Tasks | 1:N | Student creates many tasks |
| Users (student) | Progress Tracking | 1:N | Student has progress records |

---

## Data Validation Rules

### Users
- `username`: required, min 3 chars, max 50 chars, alphanumeric + underscore
- `email`: required, valid email format
- `passwordHash`: required, min 60 chars (bcrypt hash)
- `role`: required, enum ["student", "instructor", "admin"]

### Courses
- `courseName`: required, min 3 chars, max 200 chars
- `courseCode`: required, unique, format: 2-4 letters + 3 digits (e.g., CS101)
- `instructorId`: required, must reference valid user with role="instructor"
- `capacity`: min 1, max 500
- `credits`: min 0, max 12

### Enrollments
- `{studentId, courseId}`: must be unique (student can't enroll twice)
- `studentId`: must reference user with role="student"
- `gradePoints`: min 0, max 100
- `attendance`: min 0, max 100
- `progress`: min 0, max 100

### Quizzes
- `totalPoints`: min 0
- `passingScore`: min 0, max totalPoints
- `duration`: min 1 minute if set
- `maxAttempts`: min 1 if set
- `availableFrom`: must be before `availableTo`

### Questions
- `points`: min 0
- `options`: required for multiple_choice, must have at least 2 options
- `options.isCorrect`: exactly one option must be true for multiple_choice

---

## Security Considerations

1. **Password Storage**: Always hash with bcrypt (cost factor 10+)
2. **User IDs**: Never expose internal ObjectIds in URLs, use UUIDs or slugs
3. **Input Validation**: Validate all inputs on backend before saving
4. **Authorization**: Always verify user owns the resource before modifying
5. **Indexes**: Add indexes on frequently queried fields for performance
6. **Soft Deletes**: Consider adding `isDeleted` flag instead of hard deletes

---

## Migration Notes

To migrate from current schema to this design:

1. Create `Users` collection from existing hardcoded users
2. Add `instructorId` to all existing courses
3. Create `Enrollments` for student-course relationships
4. Add `studentId` to all existing tasks
5. Move quiz data from separate collections into unified structure
6. Create indexes for all foreign key fields
7. Implement authentication middleware
8. Update all API endpoints to use new schema

---

## Example Queries

### Get all courses for a student (enrolled):
```javascript
// Step 1: Get enrollments
const enrollments = await db.enrollments.find({
    studentId: ObjectId(studentId),
    status: "active"
}).toArray();

// Step 2: Get course details
const courseIds = enrollments.map(e => e.courseId);
const courses = await db.courses.find({
    _id: { $in: courseIds }
}).toArray();
```

### Get all courses created by instructor:
```javascript
const courses = await db.courses.find({
    instructorId: ObjectId(instructorId)
}).toArray();
```

### Get student's quiz attempts with scores:
```javascript
const attempts = await db.quizAttempts.find({
    studentId: ObjectId(studentId),
    status: "submitted"
}).sort({ submittedAt: -1 }).toArray();
```

### Get pending tasks for student:
```javascript
const tasks = await db.tasks.find({
    studentId: ObjectId(studentId),
    isCompleted: false,
    dueDate: { $gte: new Date() }
}).sort({ dueDate: 1 }).toArray();
```

---

## Performance Optimization

1. **Compound Indexes**:
   - `{studentId, courseId}` on Enrollments
   - `{studentId, isCompleted}` on Tasks
   - `{quizId, studentId}` on Quiz Attempts

2. **Denormalization**:
   - Store `instructorName` in Courses (avoid joins)
   - Store `courseName` in Enrollments (if needed frequently)
   - Cache `enrolledCount` in Courses

3. **Caching Strategy**:
   - Cache course lists per instructor
   - Cache student enrollments
   - Invalidate on updates

4. **Pagination**:
   - Implement cursor-based pagination for large lists
   - Limit results to 20-50 items per page

---

This database design provides a solid foundation for the AI Study Companion application with proper relationships, data integrity, and scalability.
