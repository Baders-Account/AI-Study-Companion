

import {courses, tasks, quizz, materials} from './src/configs/db.config.js'   // mongoDB  
import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })


const app= express();
const PORT = 3000; 
//require('dotenv').config();


const router = express.Router();



// hashing for passwords   //can be used if you want 
async function hashing(password){
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashDigest = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashDigest));
    const hashedPass = hashArray.map(byte => byte.toString(16).padStart(2,'0')).join('');   /// in hexadecimal
    return hashedPass;
}





// router




// courses

router.get("/courses", async (req, res)=>{
        
        //retrive courses     

    try {
   
    const data = await courses.find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

router.post("/courses", async (req, res)=>{
       
        // add 
        
        const addedCourse = req.body;
        
        courses.insertOne(addedCourse);
        
        res.sendStatus(201)
    
})

router.delete('/courses/:id' ,async (req,res) =>{
        const removedID= Number(req.params.id)
        console.log(removedID);
        await courses.deleteOne({_id: removedID})
        res.sendStatus(201);
}


)

router.get("/quizz", async (req,res)=>{
        try {
                const data = await quizz.find().toArray();
                res.json(data);
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

router.delete("/quizz/:id", async (req,res) =>{
        try {
                const removedID= Number(req.params.id);
                await quizz.deleteOne({id: removedID});
                res.sendStatus(204); //NO CONTENT
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

router.post("/quizz", async (req, res)=>{
        try {
                const newQuizz = req.body;
                await quizz.insertOne(newQuizz);
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

router.post("/quizz/ai-create", async (req,res)=>{
        const { quizName, course, notesText } = req.body;
        // Check if fields exist and are not empty after trimming
        if(!quizName || !course || !notesText){
                return res.status(400).json({ error: "Missing quizName, course or notesText. All fields are required." });
        }
        if(!quizName.trim() || !course.trim() || !notesText.trim()){
                return res.status(400).json({ error: "quizName, course and notesText cannot be empty or whitespace only." });
        }
        try{
                const system = "Generate exactly 10 multiple-choice questions based only on the provided notes. Return strict JSON with key 'quiz' as an array of 10 items. Each item must have: question (string), options (object with keys A,B,C,D strings), answer (one of 'A','B','C','D'). No extra text.";
                const completion = await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [
                                { role: "system", content: system },
                                { role: "user", content: notesText }
                        ]
                });
                if(!completion.choices || !completion.choices[0] || !completion.choices[0].message || !completion.choices[0].message.content){
                        return res.status(500).json({ error: "Invalid AI response format" });
                }
                const raw = completion.choices[0].message.content;
                let parsed;
                try{ 
                        parsed = JSON.parse(raw);
                } catch(e){ 
                        return res.status(500).json({ error: "Invalid AI JSON response. The AI did not return valid JSON." });
                }
                if(!parsed || !parsed.quiz || !Array.isArray(parsed.quiz)){
                        return res.status(500).json({ error: "AI response missing 'quiz' array. Please try again." });
                }
                const id = Date.now();
                await quizz.insertOne({ id, quizName, course, quizLink: "#", questions: parsed.quiz });
                res.status(201).json({ id });
        } catch (error){
                res.status(500).json({ error: error.message });
        }
});

router.get("/quizz/:id/details", async (req,res)=>{
        try{
                const id = Number(req.params.id);
                const doc = await quizz.findOne({ id });
                if(!doc){ return res.status(404).json({ error: "Not found" }) }
                res.json(doc);
        } catch (error){
                res.status(500).json({ error: error.message });
        }
});

// to do list 

router.get("/tasks", async(req, res)=>{
        // read tasks
         try {
            
        const data = await tasks.find().toArray();
        res.json(data);
        } catch (err) {
        res.status(500).json({ error: err.message });
                                                }
})



        // add 
router.post('/tasks/add-todo', async(req,res)=>{
             const newTask = req.body;
             await tasks.insertOne(newTask);
             res.sendStatus(201);

})

router.post('/tasks/toggle', async(req,res)=>{
            
            const {id, completed} = req.body
            
           
           
            
            await tasks.updateOne({_id:id},{$set:{completed: completed} });
            res.sendStatus(201);
})

       
router.delete('/tasks/clearAll', async(req,res)=>{



            await tasks.deleteMany({});
            res.sendStatus(201);
})


// Materials endpoints

// GET all materials (without file content for list view)
router.get("/materials", async (req, res) => {
    try {
        const data = await materials.find({}, {
            projection: { fileContent: 0 } // exclude file content for performance
        }).toArray();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single material with file content (for download)
router.get("/materials/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const doc = await materials.findOne({ id });
        if (!doc) {
            return res.status(404).json({ error: "Material not found" });
        }
        res.json(doc);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST new material (file upload as base64)
router.post("/materials", async (req, res) => {
    const { title, description, courseName, type, fileContent, fileName, uploadedBy } = req.body;

    // Validate required fields
    if (!title || !courseName || !fileContent || !fileName) {
        return res.status(400).json({
            error: "Missing required fields: title, courseName, fileContent, fileName"
        });
    }

    try {
        const id = Date.now();
        const newMaterial = {
            id,
            title: title.trim(),
            description: description?.trim() || "",
            courseName: courseName.trim(),
            type: type || fileName.split('.').pop().toLowerCase(),
            fileContent,
            fileName,
            uploadedBy: uploadedBy || "unknown",
            uploadedAt: new Date()
        };

        await materials.insertOne(newMaterial);
        res.status(201).json({ id, message: "Material uploaded successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE material
router.delete("/materials/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const result = await materials.deleteOne({ id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Material not found" });
        }
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


        // remove
    

const deployedFrontendUrl = 'https://ai-study-companion-three.vercel.app';
const localDevUrl = 'http://localhost:5173'; 

app.use(express.json({ limit: '20mb' }));  // increased for base64 file uploads  

app.use(cors({
    origin: [deployedFrontendUrl, localDevUrl], 
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));




// Root route for health check
app.get("/", (req, res) => {
    res.json({ message: "Backend API is running", status: "ok" });
});

// Debug middleware to log requests
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
});

// All requests to API begin with /api
app.use("/api", router);

// Fallback for any unmatched routes
app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// Export handler for Vercel serverless functions
export default app;

// For local development
if(process.env.NODE_ENV === 'development' || !process.env.VERCEL){
    app.listen(PORT, ()=>{
        console.log(`Server running on http://localhost:${PORT}`)
    });
}


