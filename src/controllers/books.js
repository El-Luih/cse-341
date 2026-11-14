import { getAllBooks, getBookById, createBook, updateBookById, deleteBookById } from "../models/books.js";
import { getDb } from "../db/connect.js";

const sendValidationError = (res, details) => {
    return res.status(400).json({
        message: "Validation failed",
        details
    });
};

const isNonNegativeInteger = (value) => {
    return typeof value === "number" && Number.isInteger(value) && value >= 0;
};

const isValidDateString = (value) => {
    if (typeof value !== "string" || value.trim().length === 0) {
        return false;
    }

    const date = new Date(value);
    return !Number.isNaN(date.getTime());
};

const parseRouteId = (routeValue) => {
    if (typeof routeValue !== "string" || routeValue.trim() === "") {
        return { valid: false, value: null };
    }

    const normalizedValue = Number(routeValue);

    if (!Number.isInteger(normalizedValue) || normalizedValue < 0 || String(normalizedValue) !== routeValue.trim()) {
        return { valid: false, value: null };
    }

    return { valid: true, value: normalizedValue };
};

const getBooksHandler = async (req, res) => {
    if (req.accepts("application/json") === false) {
        return res.status(406).json({ message: "Unsupported response format" });
    }

    try {
        const booksData = await getAllBooks();
        return res.status(200).json(booksData);
    } catch (error) {
        console.error("GET /books failed", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getBookByIdHandler = async (req, res) => {
    const routeId = parseRouteId(req.params.id);

    if (!routeId.valid) {
        return sendValidationError(res, [{ field: "id", issue: "must be a valid non-negative integer" }]);
    }

    if (req.accepts("application/json") === false) {
        return res.status(406).json({ message: "Unsupported response format" });
    }

    try {
        const bookData = await getBookById(routeId.value);

        if (!bookData) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json(bookData);
    } catch (error) {
        console.error("GET /books/:id failed:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const createBookHandler = async (req, res) => {
    if (!req.is("application/json")) {
        return res.status(415).json({ message: "Unsupported media type" });
    }

    if (req.accepts("application/json") === false) {
        return res.status(406).json({ message: "Unsupported response format" });
    }

    const bookData = req.body;
    const details = [];

    if (!bookData || typeof bookData !== "object" || Array.isArray(bookData)) {
        return sendValidationError(res, [{ field: "body", issue: "must be a JSON object" }]);
    }

    if (!isNonNegativeInteger(bookData.id)) {
        details.push({ field: "id", issue: "must be a non-negative integer" });
    }

    if (!isNonNegativeInteger(bookData.authorId)) {
        details.push({ field: "authorId", issue: "must be a non-negative integer" });
    }

    if (typeof bookData.title !== "string" || bookData.title.trim().length === 0) {
        details.push({ field: "title", issue: "must be a non-empty string" });
    }

    if (!isValidDateString(bookData.publicationDate)) {
        details.push({ field: "publicationDate", issue: "must be a valid date string" });
    }

    if (details.length > 0) {
        return sendValidationError(res, details);
    }

    try {
        const database = await getDb();
        const existingBook = await database.collection("books").findOne({ id: bookData.id });

        if (existingBook) {
            return res.status(409).json({ message: "Book id already exists" });
        }

        // Author validation will be added in a later update.
        // This check is intentionally left out for the current book issue scope.

        const newBook = {
            id: bookData.id,
            authorId: bookData.authorId,
            title: bookData.title.trim(),
            publicationDate: bookData.publicationDate
        };

        const createdBook = await createBook(newBook);
        return res.status(201).json(createdBook);
    } catch (error) {
        console.error("POST /books failed:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateBookByIdHandler = async (req, res) => {
    const routeId = parseRouteId(req.params.id);

    if (!routeId.valid) {
        return sendValidationError(res, [{ field: "id", issue: "must be a valid non-negative integer" }]);
    }

    if (!req.is("application/json")) {
        return res.status(415).json({ message: "Unsupported media type" });
    }

    if (req.accepts("application/json") === false) {
        return res.status(406).json({ message: "Unsupported response format" });
    }

    const updates = req.body;
    const details = [];

    if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
        return sendValidationError(res, [{ field: "body", issue: "must be a JSON object" }]);
    }

    if (Object.prototype.hasOwnProperty.call(updates, "id")) {
        details.push({ field: "id", issue: "may not be updated through this route" });
    }

    const allowedFields = ["authorId", "title", "publicationDate"];
    const updateFields = Object.keys(updates);

    if (updateFields.length === 0) {
        details.push({ field: "body", issue: "must contain at least one valid field to update" });
    }

    for (const field of updateFields) {
        if (!allowedFields.includes(field)) {
            details.push({ field, issue: "is not a valid update field" });
        }
    }

    if (Object.prototype.hasOwnProperty.call(updates, "authorId") && !isNonNegativeInteger(updates.authorId)) {
        details.push({ field: "authorId", issue: "must be a non-negative integer" });
    }

    if (Object.prototype.hasOwnProperty.call(updates, "title") && (typeof updates.title !== "string" || updates.title.trim().length === 0)) {
        details.push({ field: "title", issue: "must be a non-empty string" });
    }

    if (Object.prototype.hasOwnProperty.call(updates, "publicationDate") && !isValidDateString(updates.publicationDate)) {
        details.push({ field: "publicationDate", issue: "must be a valid date string" });
    }

    if (details.length > 0) {
        return sendValidationError(res, details);
    }

    try {
        const database = await getDb();
        const existingBook = await database.collection("books").findOne({ id: routeId.value });

        if (!existingBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Author validation will be added in a later update.
        // This check is intentionally left out for the current book issue scope.

        const sanitizedUpdates = {};

        if (Object.prototype.hasOwnProperty.call(updates, "authorId")) {
            sanitizedUpdates.authorId = updates.authorId;
        }

        if (Object.prototype.hasOwnProperty.call(updates, "title")) {
            sanitizedUpdates.title = updates.title.trim();
        }

        if (Object.prototype.hasOwnProperty.call(updates, "publicationDate")) {
            sanitizedUpdates.publicationDate = updates.publicationDate;
        }

        const updatedBook = await updateBookById(routeId.value, sanitizedUpdates);
        return res.status(200).json(updatedBook);
    } catch (error) {
        console.error("PUT /books/:id failed:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteBookByIdHandler = async (req, res) => {
    const routeId = parseRouteId(req.params.id);

    if (!routeId.valid) {
        return sendValidationError(res, [{ field: "id", issue: "must be a valid non-negative integer" }]);
    }

    if (req.accepts("application/json") === false) {
        return res.status(406).json({ message: "Unsupported response format" });
    }

    try {
        const database = await getDb();
        const deletedBook = await database.collection("books").findOne({ id: routeId.value });

        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        const removedBook = await deleteBookById(routeId.value);
        return res.status(200).json(removedBook);
    } catch (error) {
        console.error("DELETE /books/:id failed:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export {
    getBooksHandler,
    getBookByIdHandler,
    createBookHandler,
    updateBookByIdHandler,
    deleteBookByIdHandler
};