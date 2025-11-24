



// setting express
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app= express();
const PORT = 3000; 
require('dotenv').config();


const router = express.Router();

// mongoDB  


const uri = "mongodb+srv://baderDB:Safer200@cluster0.ywjjum4.mongodb.net/?appName=Cluster0"
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function runConnection() {
    try{
         console.log('Connecting to MongoDB…');
            await client.connect();  // <- important

        console.log('Connected.');
        const coursesDB =  client.db('coursesDB');
        const courses = coursesDB.collection('courses').find();

        // check if it works
        

    }
    
    catch (err) {
    console.error("Connection error:", err);
  }
}

runConnection();

// router


// courses

router.get("/courses", async (req, res)=>{

        //retrive courses     

    try {
    const coursesDB =  client.db('coursesDB');
    const courses = coursesDB.collection('courses')
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


