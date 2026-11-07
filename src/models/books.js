import { getDb } from "../db/connect.js";

const getAllBooks = async () => {
    const database = await getDb();
    const books = database.collection("books").find({}).toArray();
    return books;
};

export { getAllBooks };