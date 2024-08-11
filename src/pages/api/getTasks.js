// pages/api/users.js
import clientPromise from "@/lib/mongodb.js";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const doneTaskDb = client.db('donetaskdb');
        const pendingTaskDb = client.db('pendingtaskdb');
        const doneTasks = await doneTaskDb.collection('tasks').find({}).toArray();
        const pendingTasks = await pendingTaskDb.collection('tasks').find({}).toArray();
        res.status(200).json({ doneTasks, pendingTasks });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}
