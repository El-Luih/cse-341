//IMPORTS
import express from "express";
import router from "./src/router.js";

//INITIALIZERS
const app = express();

//MIDDLEWARE
app.use(express.json());
app.use(router);

//ROUTES
app.get('/', (req , res) => {
    return res.status(200).json({ message: "Server is live" });
});


//const books = await getDb().collection("books").find({}).toArray();

export default app;