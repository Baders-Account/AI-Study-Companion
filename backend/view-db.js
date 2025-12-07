// Quick script to view MongoDB collections
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

const client = new MongoClient(process.env.uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

async function viewDB() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB\n");

        // List all databases
        const dbs = await client.db().admin().listDatabases();
        console.log("📁 DATABASES:");
        dbs.databases.forEach(db => console.log(`   - ${db.name}`));
        console.log("");

        // View courses
        const coursesDB = client.db('coursesDB');
        const courses = await coursesDB.collection('courses').find().toArray();
        console.log("📚 COURSES:", courses.length, "items");
        courses.forEach(c => console.log(`   - ${c.courseName} (id: ${c._id})`));
        console.log("");

        // View tasks
        const tasksDB = client.db('tasksDB');
        const tasks = await tasksDB.collection('toDo').find().toArray();
        console.log("✅ TASKS:", tasks.length, "items");
        tasks.forEach(t => console.log(`   - ${t.text} [${t.completed ? 'done' : 'pending'}]`));
        console.log("");

        // View quizzes
        const quizDB = client.db('quizDB');
        const quizzes = await quizDB.collection('quizz').find().toArray();
        console.log("📝 QUIZZES:", quizzes.length, "items");
        quizzes.forEach(q => console.log(`   - ${q.quizName} (course: ${q.course})`));
        console.log("");

        // View users (if any) - using correct usersDB (not old userDB)
        const usersDB = client.db('usersDB');
        const users = await usersDB.collection('users').find().toArray();
        console.log("👤 USERS:", users.length, "items");
        users.forEach(u => console.log(`   - ${JSON.stringify(u)}`));

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

viewDB();
