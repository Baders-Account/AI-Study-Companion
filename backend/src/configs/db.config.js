
import dotenv from 'dotenv'
import {MongoClient,ServerApiVersion } from 'mongodb'
//const { MongoClient, ServerApiVersion } =  require('mongodb');
dotenv.config();

const client = new MongoClient(process.env.uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


/*  just to check if the connectoin is there or not // ignore//
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

*/
async function userDB(){
    try{
        const userDB = client.db('userDB');
        const users =  userDB.collection('users');
        return users; 
    }
    catch(err){
        console.log(err);
    }
}

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
    const tasks = tasksDB.collection('toDo');
    return tasks;
  } catch (err) {
     return err;
  }

}

async function quizDB() {
  try {
    const quizDB = client.db("quizDB");
    const quizz = quizDB.collection("quizz");
    return quizz;
  } catch (error) {
    return console.log(error);
  }
}

async function notesDB() {
  try {
    const notesDB = client.db("notesDB");
    const notes = notesDB.collection("notes");
    return notes;
  } catch (error) {
    return console.log(error);
  }
}




export const courses = await coursesDB();  // this is the courses collection
export const tasks = await tasksDB();
export const quizz = await quizDB();
export const notes = await notesDB();