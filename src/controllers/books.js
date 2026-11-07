import { getAllBooks, getBookById } from "../models/books.js";

const getBooksHandler = async (req, res) => {
    try {
        const booksData = await getAllBooks();
        return res.status(200).json(booksData);
    } catch (error) {
        console.error("GET /books failed", error.message);
        return res.status(500).json({ message: "Internal server error" });
    };
};

const getBookByIdHandler = async (req, res) => {
    const bookId = parseInt(req.params.id);
    try {
        const bookData = await getBookById(bookId);

        if (!bookData) {
            return res.status(404).json({ message: "Book not found" });
        };

        return res.status(200).json(bookData);
    } catch (error) {
        console.error("GET /books:id failed:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    };
};


export { getBooksHandler, getBookByIdHandler };