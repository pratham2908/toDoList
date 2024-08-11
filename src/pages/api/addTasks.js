// pages/api/users.js
import clientPromise from "@/lib/mongodb.js";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const pendingTaskDb = client.db('pendingtaskdb');
        const task = req.body;
        const result = await pendingTaskDb.collection('tasks').insertOne(task);
        if (result.insertedId) {
            res.status(200).json({ status: 200, message: 'Task added successfully' });
        } else {
            res.status(500).json({ error: 'Failed to add task' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}
