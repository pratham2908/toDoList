// pages/api/users.js
import clientPromise from "@/lib/mongodb.js";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const pendingTaskDb = client.db('pendingtaskdb');
        const task = req.body.task;
        const modified_by = req.body.modified_by;
        const deleteResult = await pendingTaskDb.collection("tasks").deleteOne({ _id: new ObjectId(task._id) });
        if (deleteResult.deletedCount === 1) {
            res.status(200).json({ status: 200, message: 'Task deleted successfully' });
        } else {
            res.status(500).json({ error: 'Failed to delete task' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
}
