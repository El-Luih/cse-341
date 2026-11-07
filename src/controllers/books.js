import { getAllBooks } from "../models/books.js";

const getBooksHandler = async (req, res) => {
    try {
        const booksData = await getAllBooks();
        return res.status(200).json(booksData);
    } catch (error) {
        console.error("GET /books failed", error.message);
        return res.status(500).json({ message: "Internal server error" });
    };
};

export { getBooksHandler };