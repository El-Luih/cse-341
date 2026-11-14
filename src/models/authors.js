import { getDb } from "../db/connect.js";

const getAllAuthors = async () => {
    const database = await getDb();
    const authors = await database.collection("authors").find({}).sort({ id: 1 }).toArray();
    return authors;
};

const getAuthorById = async (authorId) => {
    const database = await getDb();
    const author = await database.collection("authors").findOne({ id: authorId });
    return author;
};

const createAuthor = async (author) => {
    const database = await getDb();
    await database.collection("authors").insertOne(author);
    return author;
};

const updateAuthorById = async (authorId, updates) => {
    const database = await getDb();
    const result = await database.collection("authors").findOneAndUpdate(
        { id: authorId },
        { $set: updates },
        { returnDocument: "after" }
    );

    return result?.value ?? result;
};

const deleteAuthorById = async (authorId) => {
    const database = await getDb();
    const result = await database.collection("authors").findOneAndDelete({ id: authorId });
    return result?.value ?? result;
};

export { getAllAuthors, getAuthorById, createAuthor, updateAuthorById, deleteAuthorById };
