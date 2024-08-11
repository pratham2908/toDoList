// pages/api/users.js
import clientPromise from "@/lib/mongodb.js";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db('users');
        const users = await db.collection('userData').find({}).toArray();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}
