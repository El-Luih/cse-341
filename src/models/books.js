import { getDb } from "../db/connect.js";

const getAllBooks = async () => {
    const database = await getDb();
    const books = database.collection("books").find({}).toArray();
    return books;
};

const getBookById = async (bookId) => {
    const database = await getDb();
    const book = database.collection("books").findOne({ id: bookId });
    return book;
};

export { getAllBooks, getBookById };