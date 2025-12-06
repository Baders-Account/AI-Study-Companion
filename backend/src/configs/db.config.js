
import dotenv from 'dotenv'
import { MongoClient, ServerApiVersion } from 'mongodb'
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
async function usersDB() {
  try {
    const usersDB = client.db('usersDB');
    const users = usersDB.collection('users');
    return users;
  }
  catch (err) {
    console.log(err);
  }
}

async function coursesDB() {
  try {
    const coursesDB = client.db('coursesDB');
    const courses = coursesDB.collection('courses')
    return courses;
  } catch (err) {
    console.log(err);
  }

}

async function tasksDB() {
  try {
    const tasksDB = client.db('tasksDB');
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

async function CreateViewnotesDB() {
  try {
    const CreateViewnotesDB = client.db('CreateViewnotesDB');
    const CreateViewnote = CreateViewnotesDB.collection('CreateViewnote');
    return CreateViewnote;
  } catch (err) {
    console.log(err);
  }
}

// === NEW COLLECTIONS (Task 1.1) ===

async function enrollmentsDB() {
  try {
    const enrollmentsDB = client.db('enrollmentsDB');
    const enrollments = enrollmentsDB.collection('enrollments');
    return enrollments;
  } catch (err) {
    console.log(err);
  }
}

async function materialsDB() {
  try {
    const materialsDB = client.db('materialsDB');
    const materials = materialsDB.collection('materials');
    return materials;
  } catch (err) {
    console.log(err);
  }
}

async function questionsDB() {
  try {
    const questionsDB = client.db('questionsDB');
    const questions = questionsDB.collection('questions');
    return questions;
  } catch (err) {
    console.log(err);
  }
}

async function quizAttemptsDB() {
  try {
    const quizAttemptsDB = client.db('quizAttemptsDB');
    const quizAttempts = quizAttemptsDB.collection('quizAttempts');
    return quizAttempts;
  } catch (err) {
    console.log(err);
  }
}

async function notesDB() {
  try {
    const notesDB = client.db('notesDB');
    const notes = notesDB.collection('notes');
    return notes;
  } catch (err) {
    console.log(err);
  }
}


export const courses = await coursesDB();  // this is the courses collection
export const tasks = await tasksDB();
export const quizz = await quizDB();
export const users = await usersDB();  // usersDB.users collection
export const CreateViewnote = await CreateViewnotesDB();

// === NEW COLLECTION EXPORTS (Task 1.1) ===
export const enrollments = await enrollmentsDB();
export const materials = await materialsDB();
export const questions = await questionsDB();
export const quizAttempts = await quizAttemptsDB();
export const notes = await notesDB();
