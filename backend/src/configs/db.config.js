//require('dotenv').config();
import {MongoClient,ServerApiVersion } from 'mongodb'
//const { MongoClient, ServerApiVersion } =  require('mongodb');

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




async function coursesDB(){
    try {
    const coursesDB =  client.db('coursesDB');
    const courses = coursesDB.collection('courses')
    return courses;
  } catch (err) {
    console.log(err);
  }

}

async function tasksDB(){
    try {
    const tasksDB =  client.db('tasksDB');
    const tasks = tasksDB.collection('toDo')
    const data = await tasks.find().toArray();
    res.json(data);
  } catch (err) {
     return err;
  }

}




export const courses = await coursesDB();  // this is the courses collection
export const tasks = await tasksDB();
