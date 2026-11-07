//IMPORTS
import express from "express";
import { getDb } from "./src/db/connect.js";

//INITIALIZERS
const app = express();

//MIDDLEWARE
app.use(express.json());

//ROUTES
app.get('/', (req , res) => {
    return res.status(200).json({ message: "Server is live" });
});
app.get('/trails', async (req, res) => {
    try {
        const trails = await getDb().collection("trails").find({}).toArray();
        return res.status(200).json(trails);
    } catch (error) {
        console.error("Failed to retrieve trails: ", error.message)
        return res.status(500).json({ message: 'Failed to retrieve trails' });
    }
})

//const books = await getDb().collection("books").find({}).toArray();

export default app;