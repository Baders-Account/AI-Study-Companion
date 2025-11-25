

import {courses, tasks} from './src/configs/db.config.js'   // mongoDB  
import express from 'express'
import cors from 'cors'


const app= express();
const PORT = 3000; 
//require('dotenv').config();


const router = express.Router();




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


        // remove
    
})




// to do list 

router.get("/tasks", (req, res)=>{
        // read tasks
})


router.post("/tasks", (req, res)=>{

        // add 


        // remove
    
})




app.use(cors({
  origin: 'http://localhost:5173', // React dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));




// All requests to API begin with /api
app.use("/api", router);

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`)




})


