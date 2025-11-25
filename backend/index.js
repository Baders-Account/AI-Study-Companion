

import {courses, tasks} from './src/configs/db.config.js'   // mongoDB  
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

        await courses.deleteOne({id: removedID})
        res.sendStatus(201);
}


)




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
    



app.use(express.json());  
app.use(cors({
  origin: 'http://localhost:5173', // React dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));




// All requests to API begin with /api
app.use("/api", router);

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`)




})


