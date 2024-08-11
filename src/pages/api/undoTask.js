// pages/api/users.js
import clientPromise from "@/lib/mongodb.js";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const pendingTaskDb = client.db('pendingtaskdb');
        const doneTaskDb = client.db('donetaskdb');
        const task = req.body.task;
        const result = await doneTaskDb.collection("tasks").deleteOne({ _id: new ObjectId(task._id) });
        delete task.modified_by;
        task._id = new ObjectId();
        const result2 = await pendingTaskDb.collection("tasks").insertOne(task);
        if (result.deletedCount === 1 && result2.insertedId) {
            res.status(200).json({ status: 200, message: 'Task marked as undone' });
        } else {
            res.status(500).json({ error: 'Failed to mark task as undone' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}
