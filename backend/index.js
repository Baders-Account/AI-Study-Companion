

import {courses, tasks, quizz, notes} from './src/configs/db.config.js'   // mongoDB  
import express from 'express'
import cors from 'cors'
import crypto from 'crypto'


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

//NOTES
router.get("/notes", async (req,res)=>{
        try {
                const {courseName} = req.query;
                const filter = {};
                if (courseName){
                        filter.courseName = courseName;
                }
                const data = await notes.find(filter).toArray();
                res.json(data);
        } catch (error) {
                console.error('GET /notes error:', error);
                res.status(500).json({ error: error.message });
        }
});

router.post("/notes", async (req, res)=>{
        try {
                const newNote = req.body;
                await notes.insertOne(newNote);
        } catch (error) {
                console.error('POST /notes error:', error);
                res.status(500).json({ error: error.message });
        }
});

router.delete('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await notes.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error('DELETE /notes/:id error:', err);
    res.status(500).json({ message: 'Failed to delete note' });
  }
});


//QUIZZES
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

// CREATE QUIZZ (Check the instructor)
router.post("/quizz", async (req, res)=>{
        try {
                const newQuizz = req.body;
                await quizz.insertOne(newQuizz);
        } catch (error) {
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




        // remove
    

const deployedFrontendUrl = 'https://ai-study-companion-three.vercel.app';
const localDevUrl = 'http://localhost:5173'; 

app.use(express.json());  

app.use(cors({
    origin: [deployedFrontendUrl, localDevUrl], 
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));




// All requests to API begin with /api
app.use("/api", router);

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`)




})


