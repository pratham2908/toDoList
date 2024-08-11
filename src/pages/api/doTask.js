// pages/api/users.js
import clientPromise from "@/lib/mongodb.js";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const pendingTaskDb = client.db('pendingtaskdb');
        const doneTaskDb = client.db('donetaskdb');
        const task = req.body.task;
        const modified_by = req.body.modified_by;
        const deleteResult = await pendingTaskDb.collection("tasks").deleteOne({ _id: new ObjectId(task._id) });
        task.modified_by = modified_by;
        task._id = new ObjectId();
        const insertResult = await doneTaskDb.collection("tasks").insertOne(task);
        console.log(deleteResult.deletedCount, insertResult.insertedId);
        if (deleteResult.deletedCount === 1 && insertResult.insertedId) {
            res.status(200).json({ status: 200, message: 'Task marked as done' });
        } else {
            res.status(500).json({ error: 'Failed to mark task as done' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}
