import { getDb } from "../db/connect.js";

const getAllBooks = async () => {
    const database = await getDb();
    const books = await database.collection("books").find({}).sort({ id: 1 }).toArray();
    return books;
};

const getBookById = async (bookId) => {
    const database = await getDb();
    const book = await database.collection("books").findOne({ id: bookId });
    return book;
};

const createBook = async (book) => {
    const database = await getDb();
    await database.collection("books").insertOne(book);
    return book;
};

const updateBookById = async (bookId, updates) => {
    const database = await getDb();
    const result = await database.collection("books").findOneAndUpdate(
        { id: bookId },
        { $set: updates },
        { returnDocument: "after" }
    );

    return result?.value ?? result;
};

const deleteBookById = async (bookId) => {
    const database = await getDb();
    const result = await database.collection("books").findOneAndDelete({ id: bookId });
    return result?.value ?? result;
};

export { getAllBooks, getBookById, createBook, updateBookById, deleteBookById };