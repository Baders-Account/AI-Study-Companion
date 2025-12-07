


import { courses, tasks, quizz, users, enrollments, materials, questions, notes, CreateViewnote } from './src/configs/db.config.js'   // mongoDB  
import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })


const app = express();
const PORT = 3000;
//require('dotenv').config();


const router = express.Router();







// CORS configuration
const deployedFrontendUrl = 'https://ai-study-companion-three.vercel.app';
const localDevUrl = 'http://localhost:5173';

const corsOptions = {
        origin: [deployedFrontendUrl, localDevUrl],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly for Vercel serverless (Express 5 syntax)
//app.options('{*splat}', cors(corsOptions));

// Increase payload limit for file uploads (base64 encoded files can be large)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));





// courses

// GET /api/courses - List all courses with optional filtering
router.get("/courses", async (req, res) => {
        try {
                const { status, instructorId, semester } = req.query;

                // Build filter object based on query params
                const filter = {};
                if (status) filter.status = status;
                if (instructorId) filter.instructorId = instructorId;
                if (semester) filter.semester = semester;

                const data = await courses.find(filter).toArray();
                res.json(data);
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
})

// GET /api/courses/:id - Get single course by ID
router.get("/courses/:id", async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const id = req.params.id;

                let course;
                // Try to find by ObjectId first, then by numeric _id for backwards compatibility
                try {
                        course = await courses.findOne({ _id: new ObjectId(id) });
                } catch (e) {
                        // If ObjectId fails, try numeric ID (old format)
                        course = await courses.findOne({ _id: Number(id) });
                }

                if (!course) {
                        return res.status(404).json({ error: 'Course not found' });
                }

                res.json(course);
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
})

// POST /api/courses - Create a new course with validation
router.post("/courses", async (req, res) => {
        try {
                const {
                        courseName,
                        courseCode,
                        description,
                        instructorId,
                        instructorName,
                        semester,
                        status,
                        syllabus,
                        tags,
                        startDate,
                        endDate
                } = req.body;

                // Validate required fields
                if (!courseName || !courseCode) {
                        return res.status(400).json({ error: 'courseName and courseCode are required' });
                }

                // Validate courseCode format (2-4 letters + 3 digits, e.g., CS101)
                const courseCodeRegex = /^[A-Za-z]{2,4}\d{3}$/;
                if (!courseCodeRegex.test(courseCode)) {
                        return res.status(400).json({ error: 'courseCode must be 2-4 letters followed by 3 digits (e.g., CS101)' });
                }

                // Check if courseCode already exists (unique constraint)
                const existingCourse = await courses.findOne({ courseCode: courseCode.toUpperCase() });
                if (existingCourse) {
                        return res.status(409).json({ error: 'A course with this courseCode already exists' });
                }

                const now = new Date();
                const newCourse = {
                        courseName,
                        courseCode: courseCode.toUpperCase(),
                        description: description || '',
                        instructorId: instructorId || null,
                        instructorName: instructorName || '',
                        semester: semester || 'Fall 2025',
                        status: status || 'active',
                        syllabus: syllabus || '',
                        tags: tags || [],
                        startDate: startDate ? new Date(startDate) : null,
                        endDate: endDate ? new Date(endDate) : null,
                        createdAt: now,
                        updatedAt: now
                };

                const result = await courses.insertOne(newCourse);

                res.status(201).json({
                        success: true,
                        courseId: result.insertedId,
                        message: 'Course created successfully'
                });
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
})

// PUT /api/courses/:id - Update a course
router.put("/courses/:id", async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const id = req.params.id;
                const {
                        courseName,
                        courseCode,
                        description,
                        instructorId,
                        instructorName,
                        semester,
                        status,
                        syllabus,
                        tags,
                        startDate,
                        endDate
                } = req.body;

                // Find the course first
                let course;
                let query;
                try {
                        query = { _id: new ObjectId(id) };
                        course = await courses.findOne(query);
                } catch (e) {
                        // If ObjectId fails, try numeric ID (old format)
                        query = { _id: Number(id) };
                        course = await courses.findOne(query);
                }

                if (!course) {
                        return res.status(404).json({ error: 'Course not found' });
                }

                // If courseCode is being changed, check uniqueness
                if (courseCode && courseCode.toUpperCase() !== course.courseCode) {
                        const courseCodeRegex = /^[A-Za-z]{2,4}\d{3}$/;
                        if (!courseCodeRegex.test(courseCode)) {
                                return res.status(400).json({ error: 'courseCode must be 2-4 letters followed by 3 digits (e.g., CS101)' });
                        }
                        const existingCourse = await courses.findOne({ courseCode: courseCode.toUpperCase() });
                        if (existingCourse) {
                                return res.status(409).json({ error: 'A course with this courseCode already exists' });
                        }
                }

                // Build update object with only provided fields
                const updateFields = { updatedAt: new Date() };
                if (courseName !== undefined) updateFields.courseName = courseName;
                if (courseCode !== undefined) updateFields.courseCode = courseCode.toUpperCase();
                if (description !== undefined) updateFields.description = description;
                if (instructorId !== undefined) updateFields.instructorId = instructorId;
                if (instructorName !== undefined) updateFields.instructorName = instructorName;
                if (semester !== undefined) updateFields.semester = semester;
                if (status !== undefined) updateFields.status = status;
                if (syllabus !== undefined) updateFields.syllabus = syllabus;
                if (tags !== undefined) updateFields.tags = tags;
                if (startDate !== undefined) updateFields.startDate = startDate ? new Date(startDate) : null;
                if (endDate !== undefined) updateFields.endDate = endDate ? new Date(endDate) : null;

                await courses.updateOne(query, { $set: updateFields });

                res.json({
                        success: true,
                        message: 'Course updated successfully'
                });
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
})

// DELETE /api/courses/:id - Delete a course
router.delete('/courses/:id', async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const id = req.params.id;

                let result;
                // Try to delete by ObjectId first, then by numeric _id for backwards compatibility
                try {
                        result = await courses.deleteOne({ _id: new ObjectId(id) });
                } catch (e) {
                        // If ObjectId fails, try numeric ID (old format)
                        result = await courses.deleteOne({ _id: Number(id) });
                }

                if (result.deletedCount === 0) {
                        return res.status(404).json({ error: 'Course not found' });
                }

                res.status(204).send();
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
})

router.get("/quizz", async (req, res) => {
        try {
                const data = await quizz.find().toArray();
                res.json(data);
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

router.delete("/quizz/:id", async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const id = req.params.id;

                // Find the quiz first to get its _id
                let quiz;
                let query;
                try {
                        query = { _id: new ObjectId(id) };
                        quiz = await quizz.findOne(query);
                } catch (e) {
                        // If ObjectId fails, try numeric ID (old format)
                        query = { id: Number(id) };
                        quiz = await quizz.findOne(query);
                }

                if (!quiz) {
                        return res.status(404).json({ error: "Quiz not found" });
                }

                // Delete associated questions from questions collection
                const deleteQuestionsResult = await questions.deleteMany({ quizId: quiz._id });
                console.log(`Deleted ${deleteQuestionsResult.deletedCount} questions for quiz ${quiz._id}`);

                // Also try deleting by numeric id (backward compat)
                if (quiz.id) {
                        await questions.deleteMany({ quizNumericId: quiz.id });
                }

                // Delete the quiz
                await quizz.deleteOne(query);

                res.sendStatus(204); //NO CONTENT
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

router.post("/quizz", async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const { questions: quizQuestions, ...quizData } = req.body;
                const now = new Date();

                // Build quiz document
                const quizDoc = {
                        ...quizData,
                        courseId: quizData.courseId ? new ObjectId(quizData.courseId) : null,
                        instructorId: quizData.instructorId ? new ObjectId(quizData.instructorId) : null,
                        questionsCount: quizQuestions?.length || 0,
                        createdAt: now,
                        updatedAt: now
                };

                // Insert quiz
                const quizResult = await quizz.insertOne(quizDoc);
                const quizId = quizResult.insertedId;

                // If questions provided, insert them into separate collection
                if (quizQuestions && Array.isArray(quizQuestions) && quizQuestions.length > 0) {
                        const questionsToInsert = quizQuestions.map((q, index) => ({
                                quizId: quizId,
                                questionText: q.questionText || q.question || '',
                                questionType: q.questionType || 'multiple_choice',
                                points: q.points || 10,
                                order: q.order || index + 1,
                                options: q.options || [],
                                correctAnswer: q.correctAnswer || q.answer || null,
                                explanation: q.explanation || null,
                                hints: q.hints || [],
                                media: q.media || null,
                                createdAt: now
                        }));

                        const questionsResult = await questions.insertMany(questionsToInsert);
                        const questionIds = Object.values(questionsResult.insertedIds);

                        // Update quiz with question IDs
                        await quizz.updateOne(
                                { _id: quizId },
                                { $set: { questionIds: questionIds } }
                        );
                }

                res.status(201).json({
                        success: true,
                        quizId: quizId
                });
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

router.post("/quizz/ai-create", async (req, res) => {
        const { quizName, course, notesText, courseId, instructorId } = req.body;
        // Check if fields exist and are not empty after trimming
        if (!quizName || !course || !notesText) {
                return res.status(400).json({ error: "Missing quizName, course or notesText. All fields are required." });
        }
        if (!quizName.trim() || !course.trim() || !notesText.trim()) {
                return res.status(400).json({ error: "quizName, course and notesText cannot be empty or whitespace only." });
        }
        try {
                const { ObjectId } = await import('mongodb');
                const system = "Generate exactly 10 multiple-choice questions based only on the provided notes. Return strict JSON with key 'quiz' as an array of 10 items. Each item must have: question (string), options (object with keys A,B,C,D strings), answer (one of 'A','B','C','D'). No extra text.";
                const completion = await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [
                                { role: "system", content: system },
                                { role: "user", content: notesText }
                        ]
                });
                if (!completion.choices || !completion.choices[0] || !completion.choices[0].message || !completion.choices[0].message.content) {
                        return res.status(500).json({ error: "Invalid AI response format" });
                }
                const raw = completion.choices[0].message.content;
                let parsed;
                try {
                        parsed = JSON.parse(raw);
                } catch (e) {
                        return res.status(500).json({ error: "Invalid AI JSON response. The AI did not return valid JSON." });
                }
                if (!parsed || !parsed.quiz || !Array.isArray(parsed.quiz)) {
                        return res.status(500).json({ error: "AI response missing 'quiz' array. Please try again." });
                }

                const now = new Date();
                const totalPoints = parsed.quiz.length * 10; // 10 points per question

                // Create quiz document (without embedded questions)
                const quizDoc = {
                        title: quizName,
                        course, // Keep for display
                        courseId: courseId ? new ObjectId(courseId) : null,
                        instructorId: instructorId ? new ObjectId(instructorId) : null,
                        quizLink: "#",
                        description: `AI-generated quiz for ${course}`,
                        instructions: "Answer all questions. Select the best answer for each multiple choice question.",
                        type: "practice",
                        totalPoints,
                        passingScore: Math.round(totalPoints * 0.7),
                        duration: null,
                        availableFrom: null,
                        availableTo: null,
                        allowMultipleAttempts: true,
                        maxAttempts: null,
                        showCorrectAnswers: true,
                        showScoreImmediately: true,
                        randomizeQuestions: false,
                        randomizeOptions: false,
                        isPublished: true,
                        questionsCount: parsed.quiz.length,
                        createdAt: now,
                        updatedAt: now
                };

                // Insert quiz first to get the _id
                const quizResult = await quizz.insertOne(quizDoc);
                const quizId = quizResult.insertedId;

                // Transform and insert questions into separate collection
                const questionsToInsert = parsed.quiz.map((q, index) => ({
                        quizId: quizId,
                        questionText: q.question,
                        questionType: "multiple_choice",
                        points: 10,
                        order: index + 1,
                        options: [
                                { optionId: "A", text: q.options.A, isCorrect: q.answer === "A" },
                                { optionId: "B", text: q.options.B, isCorrect: q.answer === "B" },
                                { optionId: "C", text: q.options.C, isCorrect: q.answer === "C" },
                                { optionId: "D", text: q.options.D, isCorrect: q.answer === "D" }
                        ],
                        correctAnswer: q.answer,
                        explanation: null,
                        hints: [],
                        media: null,
                        createdAt: now
                }));

                const questionsResult = await questions.insertMany(questionsToInsert);

                // Update quiz with question IDs reference
                const questionIds = Object.values(questionsResult.insertedIds);
                await quizz.updateOne(
                        { _id: quizId },
                        { $set: { questionIds: questionIds } }
                );

                res.status(201).json({
                        id: quizId,
                        questionsCreated: questionsResult.insertedCount
                });
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

router.get("/quizz/:id/details", async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const id = req.params.id;

                // Try to find by ObjectId first, then by numeric id
                let doc;
                try {
                        doc = await quizz.findOne({ _id: new ObjectId(id) });
                } catch (e) {
                        // If ObjectId fails, try numeric ID (old format)
                        doc = await quizz.findOne({ id: Number(id) });
                }

                if (!doc) {
                        return res.status(404).json({ error: "Quiz not found" });
                }

                // Fetch questions from separate collection
                let quizQuestions = [];

                // Try to find questions by quiz ObjectId
                quizQuestions = await questions.find({ quizId: doc._id }).sort({ order: 1 }).toArray();

                // If no questions found by ObjectId, try numeric id (backward compat)
                if (quizQuestions.length === 0 && doc.id) {
                        quizQuestions = await questions.find({ quizNumericId: doc.id }).sort({ order: 1 }).toArray();
                }

                // If still no questions found, check for embedded questions (legacy)
                if (quizQuestions.length === 0 && doc.questions && Array.isArray(doc.questions)) {
                        quizQuestions = doc.questions;
                }

                // Return quiz with questions joined
                res.json({
                        ...doc,
                        questions: quizQuestions
                });
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

// to do list 

router.get("/tasks", async (req, res) => {
        // read tasks
        try {

                const data = await tasks.find().toArray();
                res.json(data);
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
})



// add 
router.post('/tasks/add-todo', async (req, res) => {
        const newTask = req.body;
        await tasks.insertOne(newTask);
        res.sendStatus(201);

})

router.post('/tasks/toggle', async (req, res) => {

        const { id, completed } = req.body




        await tasks.updateOne({ _id: id }, { $set: { completed: completed } });
        res.sendStatus(201);
})


router.delete('/tasks/clearAll', async (req, res) => {



        await tasks.deleteMany({});
        res.sendStatus(201);
})




// Authentication Routes

// POST /api/auth/register - Register a new user (student or instructor only)
router.post('/auth/register', async (req, res) => {
        try {
                const { username, email, password, firstName, lastName, role } = req.body;

                // Validate required fields
                if (!username || !email || !password || !firstName || !lastName || !role) {
                        return res.status(400).json({ error: 'All fields are required: username, email, password, firstName, lastName, role' });
                }

                // REJECT admin registration - admins cannot register via signup!
                if (role === 'admin') {
                        return res.status(403).json({ error: 'Admin users cannot register. Admin access is hardcoded only.' });
                }

                // Only allow student or instructor roles
                if (role !== 'student' && role !== 'instructor') {
                        return res.status(400).json({ error: 'Role must be either "student" or "instructor"' });
                }

                // Check if username already exists
                const existingUsername = await users.findOne({ username });
                if (existingUsername) {
                        return res.status(409).json({ error: 'Username already taken' });
                }

                // Check if email already exists
                const existingEmail = await users.findOne({ email });
                if (existingEmail) {
                        return res.status(409).json({ error: 'Email already registered' });
                }

                // Hash password with bcrypt (10 salt rounds)
                const passwordHash = await bcrypt.hash(password, 10);

                // Create user document
                const now = new Date();
                const newUser = {
                        username,
                        email,
                        passwordHash,
                        role,
                        firstName,
                        lastName,
                        createdAt: now,
                        updatedAt: now,
                        lastLogin: null,
                        isActive: true
                };

                // Insert into users collection
                const result = await users.insertOne(newUser);

                res.status(201).json({
                        success: true,
                        userId: result.insertedId,
                        message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully`
                });
        } catch (error) {
                console.error('Registration error:', error);
                res.status(500).json({ error: error.message });
        }
});

// POST /api/auth/login - Login with username and password
router.post('/auth/login', async (req, res) => {
        try {
                const { username, password } = req.body;

                // Validate required fields
                if (!username || !password) {
                        return res.status(400).json({ error: 'Username and password are required' });
                }

                // Find user by username
                const user = await users.findOne({ username });
                if (!user) {
                        return res.status(401).json({ error: 'Invalid username or password' });
                }

                // Check if account is active
                if (user.isActive === false) {
                        return res.status(401).json({ error: 'Account is deactivated' });
                }

                // Compare password with bcrypt
                const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
                if (!isPasswordValid) {
                        return res.status(401).json({ error: 'Invalid username or password' });
                }

                // Update last login
                await users.updateOne(
                        { _id: user._id },
                        { $set: { lastLogin: new Date() } }
                );

                // Return user info (without sensitive data)
                res.json({
                        success: true,
                        user: {
                                _id: user._id,
                                username: user.username,
                                email: user.email,
                                role: user.role,
                                firstName: user.firstName,
                                lastName: user.lastName
                        }
                });
        } catch (error) {
                console.error('Login error:', error);
                res.status(500).json({ error: error.message });
        }
});


// Enrollments Routes

// GET /api/enrollments - Get enrollments with optional filtering by studentId or courseId
router.get('/enrollments', async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const { studentId, courseId, status } = req.query;

                // Build filter object based on query params
                const filter = {};

                // Filter by studentId if provided
                if (studentId) {
                        try {
                                filter.studentId = new ObjectId(studentId);
                        } catch (e) {
                                return res.status(400).json({ error: 'Invalid studentId format' });
                        }
                }

                // Filter by courseId if provided
                if (courseId) {
                        try {
                                filter.courseId = new ObjectId(courseId);
                        } catch (e) {
                                return res.status(400).json({ error: 'Invalid courseId format' });
                        }
                }

                // Filter by status if provided
                if (status) {
                        filter.status = status;
                }

                const data = await enrollments.find(filter).toArray();
                res.json(data);
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

// GET /api/enrollments/:id - Get single enrollment by ID
router.get('/enrollments/:id', async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const id = req.params.id;

                let enrollment;
                try {
                        enrollment = await enrollments.findOne({ _id: new ObjectId(id) });
                } catch (e) {
                        return res.status(400).json({ error: 'Invalid enrollment ID format' });
                }

                if (!enrollment) {
                        return res.status(404).json({ error: 'Enrollment not found' });
                }

                res.json(enrollment);
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

// POST /api/enrollments - Enroll a student in a course
router.post('/enrollments', async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const { studentId, courseId } = req.body;

                // Validate required fields
                if (!studentId || !courseId) {
                        return res.status(400).json({ error: 'studentId and courseId are required' });
                }

                // Convert to ObjectId
                let studentObjId, courseObjId;
                try {
                        studentObjId = new ObjectId(studentId);
                        courseObjId = new ObjectId(courseId);
                } catch (e) {
                        return res.status(400).json({ error: 'Invalid studentId or courseId format' });
                }

                // Check if student exists and is actually a student
                const student = await users.findOne({ _id: studentObjId });
                if (!student) {
                        return res.status(404).json({ error: 'Student not found' });
                }
                if (student.role !== 'student') {
                        return res.status(400).json({ error: 'User is not a student' });
                }

                // Check if course exists
                let course;
                try {
                        course = await courses.findOne({ _id: courseObjId });
                } catch (e) {
                        // Try numeric ID for backwards compatibility
                        course = await courses.findOne({ _id: Number(courseId) });
                        if (course) {
                                courseObjId = course._id; // Use the numeric ID
                        }
                }
                if (!course) {
                        return res.status(404).json({ error: 'Course not found' });
                }

                // Check if enrollment already exists (unique constraint)
                const existingEnrollment = await enrollments.findOne({
                        studentId: studentObjId,
                        courseId: courseObjId
                });
                if (existingEnrollment) {
                        return res.status(409).json({ error: 'Student is already enrolled in this course' });
                }

                // Create enrollment document
                const now = new Date();
                const newEnrollment = {
                        studentId: studentObjId,
                        courseId: courseObjId,
                        enrolledAt: now,
                        status: 'active',
                        lastAccessed: now,
                        completedAt: null
                };

                const result = await enrollments.insertOne(newEnrollment);

                res.status(201).json({
                        success: true,
                        enrollmentId: result.insertedId,
                        message: 'Student enrolled successfully'
                });
        } catch (error) {
                console.error('Enrollment error:', error);
                res.status(500).json({ error: error.message });
        }
});

// PUT /api/enrollments/:id - Update enrollment status
router.put('/enrollments/:id', async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const id = req.params.id;
                const { status, lastAccessed, completedAt } = req.body;

                // Find the enrollment
                let enrollment;
                let query;
                try {
                        query = { _id: new ObjectId(id) };
                        enrollment = await enrollments.findOne(query);
                } catch (e) {
                        return res.status(400).json({ error: 'Invalid enrollment ID format' });
                }

                if (!enrollment) {
                        return res.status(404).json({ error: 'Enrollment not found' });
                }

                // Validate status if provided
                const validStatuses = ['active', 'completed', 'dropped', 'withdrawn'];
                if (status && !validStatuses.includes(status)) {
                        return res.status(400).json({
                                error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
                        });
                }

                // Build update object
                const updateFields = {};
                if (status !== undefined) {
                        updateFields.status = status;
                        // If completing the course, set completedAt
                        if (status === 'completed' && !enrollment.completedAt) {
                                updateFields.completedAt = new Date();
                        }
                }
                if (lastAccessed !== undefined) {
                        updateFields.lastAccessed = new Date(lastAccessed);
                }
                if (completedAt !== undefined) {
                        updateFields.completedAt = completedAt ? new Date(completedAt) : null;
                }

                if (Object.keys(updateFields).length === 0) {
                        return res.status(400).json({ error: 'No valid fields to update' });
                }

                await enrollments.updateOne(query, { $set: updateFields });

                res.json({
                        success: true,
                        message: 'Enrollment updated successfully'
                });
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

// DELETE /api/enrollments/:id - Unenroll (delete enrollment)
router.delete('/enrollments/:id', async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const id = req.params.id;

                let result;
                try {
                        result = await enrollments.deleteOne({ _id: new ObjectId(id) });
                } catch (e) {
                        return res.status(400).json({ error: 'Invalid enrollment ID format' });
                }

                if (result.deletedCount === 0) {
                        return res.status(404).json({ error: 'Enrollment not found' });
                }

                res.status(204).send();
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});


// Materials Routes

// GET /api/materials - Get materials with optional filtering by courseId or instructorId
router.get('/materials', async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const { courseId, instructorId, type, isPublished } = req.query;

                // Build filter object based on query params
                const filter = {};

                // Filter by courseId if provided
                if (courseId) {
                        try {
                                filter.courseId = new ObjectId(courseId);
                        } catch (e) {
                                return res.status(400).json({ error: 'Invalid courseId format' });
                        }
                }

                // Filter by instructorId if provided
                if (instructorId) {
                        try {
                                filter.instructorId = new ObjectId(instructorId);
                        } catch (e) {
                                return res.status(400).json({ error: 'Invalid instructorId format' });
                        }
                }

                // Filter by type if provided
                if (type) {
                        filter.type = type;
                }

                // Filter by isPublished if provided
                if (isPublished !== undefined) {
                        filter.isPublished = isPublished === 'true';
                }

                const data = await materials.find(filter).sort({ uploadedAt: -1 }).toArray();
                res.json(data);
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

// GET /api/materials/:id - Get single material by ID
router.get('/materials/:id', async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const id = req.params.id;

                let material;
                try {
                        material = await materials.findOne({ _id: new ObjectId(id) });
                } catch (e) {
                        return res.status(400).json({ error: 'Invalid material ID format' });
                }

                if (!material) {
                        return res.status(404).json({ error: 'Material not found' });
                }

                res.json(material);
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

// POST /api/materials - Upload a new material (instructors only)
router.post('/materials', async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const {
                        courseId,
                        instructorId,
                        title,
                        description,
                        type,
                        fileUrl,
                        fileSize,
                        fileName,
                        mimeType,
                        topic,
                        isPublished,
                        fileContent // Optional: base64 encoded file content for small files
                } = req.body;

                // Validate required fields
                if (!courseId || !instructorId || !title || !type) {
                        return res.status(400).json({
                                error: 'Required fields: courseId, instructorId, title, type'
                        });
                }

                // Validate type
                const validTypes = ['pdf', 'video', 'link', 'document', 'slides'];
                if (!validTypes.includes(type)) {
                        return res.status(400).json({
                                error: `Invalid type. Must be one of: ${validTypes.join(', ')}`
                        });
                }

                // Convert IDs to ObjectId
                let courseObjId, instructorObjId;
                try {
                        courseObjId = new ObjectId(courseId);
                        instructorObjId = new ObjectId(instructorId);
                } catch (e) {
                        return res.status(400).json({ error: 'Invalid courseId or instructorId format' });
                }

                // Verify course exists
                let course;
                try {
                        course = await courses.findOne({ _id: courseObjId });
                } catch (e) {
                        // Try numeric ID for backwards compatibility
                        course = await courses.findOne({ _id: Number(courseId) });
                        if (course) {
                                courseObjId = course._id;
                        }
                }
                if (!course) {
                        return res.status(404).json({ error: 'Course not found' });
                }

                // Verify instructor exists and has instructor role
                const instructor = await users.findOne({ _id: instructorObjId });
                if (!instructor) {
                        return res.status(404).json({ error: 'Instructor not found' });
                }
                if (instructor.role !== 'instructor' && instructor.role !== 'admin') {
                        return res.status(403).json({ error: 'User is not an instructor' });
                }

                // Create material document
                const now = new Date();
                const newMaterial = {
                        courseId: courseObjId,
                        instructorId: instructorObjId,
                        title,
                        description: description || '',
                        type,
                        fileUrl: fileUrl || '',
                        fileSize: fileSize || 0,
                        fileName: fileName || '',
                        mimeType: mimeType || '',
                        topic: topic || '',
                        isPublished: isPublished !== undefined ? isPublished : true,
                        uploadedAt: now,
                        updatedAt: now
                };

                // Store base64 content if provided (for small files)
                if (fileContent) {
                        // Check file size limit (16MB max for MongoDB documents)
                        const contentSize = Buffer.byteLength(fileContent, 'base64');
                        if (contentSize > 16 * 1024 * 1024) {
                                return res.status(400).json({
                                        error: 'File too large. Maximum size is 16MB for direct upload. Use fileUrl for larger files.'
                                });
                        }
                        newMaterial.fileContent = fileContent;
                        newMaterial.fileSize = contentSize;
                }

                const result = await materials.insertOne(newMaterial);

                res.status(201).json({
                        success: true,
                        materialId: result.insertedId,
                        message: 'Material uploaded successfully'
                });
        } catch (error) {
                console.error('Material upload error:', error);
                res.status(500).json({ error: error.message });
        }
});

// PUT /api/materials/:id - Update a material
router.put('/materials/:id', async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const id = req.params.id;
                const {
                        title,
                        description,
                        type,
                        fileUrl,
                        fileSize,
                        fileName,
                        mimeType,
                        topic,
                        isPublished,
                        fileContent
                } = req.body;

                // Find the material
                let material;
                let query;
                try {
                        query = { _id: new ObjectId(id) };
                        material = await materials.findOne(query);
                } catch (e) {
                        return res.status(400).json({ error: 'Invalid material ID format' });
                }

                if (!material) {
                        return res.status(404).json({ error: 'Material not found' });
                }

                // Validate type if provided
                if (type) {
                        const validTypes = ['pdf', 'video', 'link', 'document', 'slides'];
                        if (!validTypes.includes(type)) {
                                return res.status(400).json({
                                        error: `Invalid type. Must be one of: ${validTypes.join(', ')}`
                                });
                        }
                }

                // Build update object with only provided fields
                const updateFields = { updatedAt: new Date() };
                if (title !== undefined) updateFields.title = title;
                if (description !== undefined) updateFields.description = description;
                if (type !== undefined) updateFields.type = type;
                if (fileUrl !== undefined) updateFields.fileUrl = fileUrl;
                if (fileSize !== undefined) updateFields.fileSize = fileSize;
                if (fileName !== undefined) updateFields.fileName = fileName;
                if (mimeType !== undefined) updateFields.mimeType = mimeType;
                if (topic !== undefined) updateFields.topic = topic;
                if (isPublished !== undefined) updateFields.isPublished = isPublished;

                // Handle file content update
                if (fileContent !== undefined) {
                        if (fileContent) {
                                const contentSize = Buffer.byteLength(fileContent, 'base64');
                                if (contentSize > 16 * 1024 * 1024) {
                                        return res.status(400).json({
                                                error: 'File too large. Maximum size is 16MB for direct upload.'
                                        });
                                }
                                updateFields.fileContent = fileContent;
                                updateFields.fileSize = contentSize;
                        } else {
                                // Remove file content if explicitly set to null/empty
                                updateFields.fileContent = null;
                        }
                }

                if (Object.keys(updateFields).length === 1) { // Only updatedAt
                        return res.status(400).json({ error: 'No valid fields to update' });
                }

                await materials.updateOne(query, { $set: updateFields });

                res.json({
                        success: true,
                        message: 'Material updated successfully'
                });
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

// DELETE /api/materials/:id - Delete a material
router.delete('/materials/:id', async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const id = req.params.id;

                let result;
                try {
                        result = await materials.deleteOne({ _id: new ObjectId(id) });
                } catch (e) {
                        return res.status(400).json({ error: 'Invalid material ID format' });
                }

                if (result.deletedCount === 0) {
                        return res.status(404).json({ error: 'Material not found' });
                }

                res.status(204).send();
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});


// Notes Routes (Task 8.1)

// GET /api/notes - Get notes with optional filtering by studentId or courseId
router.get('/notes', async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const { studentId, courseId, isPinned, isShared } = req.query;

                // Build filter object based on query params
                const filter = {};

                // Filter by studentId if provided
                if (studentId) {
                        try {
                                filter.studentId = new ObjectId(studentId);
                        } catch (e) {
                                return res.status(400).json({ error: 'Invalid studentId format' });
                        }
                }

                // Filter by courseId if provided
                if (courseId) {
                        try {
                                filter.courseId = new ObjectId(courseId);
                        } catch (e) {
                                return res.status(400).json({ error: 'Invalid courseId format' });
                        }
                }

                // Filter by isPinned if provided
                if (isPinned !== undefined) {
                        filter.isPinned = isPinned === 'true';
                }

                // Filter by isShared if provided
                if (isShared !== undefined) {
                        filter.isShared = isShared === 'true';
                }

                // Sort by isPinned (pinned first), then by updatedAt (newest first)
                const data = await notes.find(filter).sort({ isPinned: -1, updatedAt: -1 }).toArray();
                res.json(data);
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

// GET /api/notes/:id - Get single note by ID
router.get('/notes/:id', async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const id = req.params.id;

                let note;
                try {
                        note = await notes.findOne({ _id: new ObjectId(id) });
                } catch (e) {
                        return res.status(400).json({ error: 'Invalid note ID format' });
                }

                if (!note) {
                        return res.status(404).json({ error: 'Note not found' });
                }

                // Update lastViewedAt
                await notes.updateOne(
                        { _id: new ObjectId(id) },
                        { $set: { lastViewedAt: new Date() } }
                );

                res.json(note);
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

// POST /api/notes - Create a new note
router.post('/notes', async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const {
                        studentId,
                        courseId,
                        title,
                        content,
                        tags,
                        color,
                        isPinned,
                        isShared,
                        relatedMaterialId
                } = req.body;

                // Validate required fields
                if (!studentId || !title) {
                        return res.status(400).json({
                                error: 'Required fields: studentId, title'
                        });
                }

                // Convert studentId to ObjectId
                let studentObjId;
                try {
                        studentObjId = new ObjectId(studentId);
                } catch (e) {
                        return res.status(400).json({ error: 'Invalid studentId format' });
                }

                // Verify student exists
                const student = await users.findOne({ _id: studentObjId });
                if (!student) {
                        return res.status(404).json({ error: 'Student not found' });
                }

                // Convert courseId to ObjectId if provided
                let courseObjId = null;
                if (courseId) {
                        try {
                                courseObjId = new ObjectId(courseId);
                                // Verify course exists
                                let course = await courses.findOne({ _id: courseObjId });
                                if (!course) {
                                        // Try numeric ID for backwards compatibility
                                        course = await courses.findOne({ _id: Number(courseId) });
                                        if (course) {
                                                courseObjId = course._id;
                                        } else {
                                                return res.status(404).json({ error: 'Course not found' });
                                        }
                                }
                        } catch (e) {
                                return res.status(400).json({ error: 'Invalid courseId format' });
                        }
                }

                // Convert relatedMaterialId to ObjectId if provided
                let materialObjId = null;
                if (relatedMaterialId) {
                        try {
                                materialObjId = new ObjectId(relatedMaterialId);
                                // Verify material exists
                                const material = await materials.findOne({ _id: materialObjId });
                                if (!material) {
                                        return res.status(404).json({ error: 'Related material not found' });
                                }
                        } catch (e) {
                                return res.status(400).json({ error: 'Invalid relatedMaterialId format' });
                        }
                }

                // Create note document
                const now = new Date();
                const newNote = {
                        studentId: studentObjId,
                        courseId: courseObjId,
                        title,
                        content: content || '',
                        tags: tags || [],
                        color: color || '#FFFFFF',
                        isPinned: isPinned || false,
                        isShared: isShared || false,
                        createdAt: now,
                        updatedAt: now,
                        lastViewedAt: now,
                        relatedMaterialId: materialObjId
                };

                const result = await notes.insertOne(newNote);

                res.status(201).json({
                        success: true,
                        noteId: result.insertedId,
                        message: 'Note created successfully'
                });
        } catch (error) {
                console.error('Note creation error:', error);
                res.status(500).json({ error: error.message });
        }
});

// PUT /api/notes/:id - Update a note
router.put('/notes/:id', async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const id = req.params.id;
                const {
                        title,
                        content,
                        courseId,
                        tags,
                        color,
                        isPinned,
                        isShared,
                        relatedMaterialId
                } = req.body;

                // Find the note
                let note;
                let query;
                try {
                        query = { _id: new ObjectId(id) };
                        note = await notes.findOne(query);
                } catch (e) {
                        return res.status(400).json({ error: 'Invalid note ID format' });
                }

                if (!note) {
                        return res.status(404).json({ error: 'Note not found' });
                }

                // Build update object with only provided fields
                const updateFields = { updatedAt: new Date() };

                if (title !== undefined) updateFields.title = title;
                if (content !== undefined) updateFields.content = content;
                if (tags !== undefined) updateFields.tags = tags;
                if (color !== undefined) updateFields.color = color;
                if (isPinned !== undefined) updateFields.isPinned = isPinned;
                if (isShared !== undefined) updateFields.isShared = isShared;

                // Handle courseId update
                if (courseId !== undefined) {
                        if (courseId === null) {
                                updateFields.courseId = null;
                        } else {
                                try {
                                        const courseObjId = new ObjectId(courseId);
                                        let course = await courses.findOne({ _id: courseObjId });
                                        if (!course) {
                                                course = await courses.findOne({ _id: Number(courseId) });
                                                if (course) {
                                                        updateFields.courseId = course._id;
                                                } else {
                                                        return res.status(404).json({ error: 'Course not found' });
                                                }
                                        } else {
                                                updateFields.courseId = courseObjId;
                                        }
                                } catch (e) {
                                        return res.status(400).json({ error: 'Invalid courseId format' });
                                }
                        }
                }

                // Handle relatedMaterialId update
                if (relatedMaterialId !== undefined) {
                        if (relatedMaterialId === null) {
                                updateFields.relatedMaterialId = null;
                        } else {
                                try {
                                        const materialObjId = new ObjectId(relatedMaterialId);
                                        const material = await materials.findOne({ _id: materialObjId });
                                        if (!material) {
                                                return res.status(404).json({ error: 'Related material not found' });
                                        }
                                        updateFields.relatedMaterialId = materialObjId;
                                } catch (e) {
                                        return res.status(400).json({ error: 'Invalid relatedMaterialId format' });
                                }
                        }
                }

                if (Object.keys(updateFields).length === 1) { // Only updatedAt
                        return res.status(400).json({ error: 'No valid fields to update' });
                }

                await notes.updateOne(query, { $set: updateFields });

                res.json({
                        success: true,
                        message: 'Note updated successfully'
                });
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/notes/:id', async (req, res) => {
        try {
                const { ObjectId } = await import('mongodb');
                const id = req.params.id;

                let result;
                try {
                        result = await notes.deleteOne({ _id: new ObjectId(id) });
                } catch (e) {
                        return res.status(400).json({ error: 'Invalid note ID format' });
                }

                if (result.deletedCount === 0) {
                        return res.status(404).json({ error: 'Note not found' });
                }

                res.status(204).send();
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

//CREATE AND VIEW NOTES
router.get("/CreateViewnote", async (req, res) => {
        try {
                const { courseName } = req.query;
                const filter = {};
                if (courseName) {
                        filter.courseName = courseName;
                }
                const data = await CreateViewnote.find(filter).toArray();
                res.json(data);
        } catch (error) {
                console.error('GET /notes error:', error);
                res.status(500).json({ error: error.message });
        }
});

router.post("/CreateViewnote", async (req, res) => {
        try {
                const newNote = req.body;
                newNote.courseName = String(newNote.courseName);
                const result = await CreateViewnote.insertOne(newNote);
                res.status(201).json({
                        message: "Note created",
                        insertedId: result.insertedId,
                });
        } catch (error) {
                console.error('POST /notes error:', error);
                res.status(500).json({ error: error.message });
        }
});

router.delete('/CreateViewnote/:id', async (req, res) => {
        try {
                const { id } = req.params;

                const result = await CreateViewnote.deleteOne({ id });

                if (result.deletedCount === 0) {
                        return res.status(404).json({ message: 'Note not found' });
                }

                res.sendStatus(204);
        } catch (err) {
                console.error('DELETE /notes/:id error:', err);
                res.status(500).json({ message: 'Failed to delete note' });
        }
});



// remove









// Debug middleware to log requests
app.use((req, res, next) => {
         console.log(`[${req.method}] ${req.path}`);
         next();
});



app.get("/", (req, res) => {
res.json({ message: "Backend API is running", status: "ok" });
});



app.use("/api", router);






app.use((req, res) => {
         res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});



const RENDER_PORT = process.env.PORT || 3000; 


app.listen(RENDER_PORT, () => {
    console.log(`Server is LIVE and listening on port ${RENDER_PORT}`);
});





