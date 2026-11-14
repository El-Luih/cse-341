import { getAllAuthors, getAuthorById, createAuthor, updateAuthorById, deleteAuthorById } from "../models/authors.js";
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

const getAuthorsHandler = async (req, res) => {
    if (req.accepts("application/json") === false) {
        return res.status(406).json({ message: "Unsupported response format" });
    }

    try {
        const authorsData = await getAllAuthors();
        return res.status(200).json(authorsData);
    } catch (error) {
        console.error("GET /authors failed", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAuthorByIdHandler = async (req, res) => {
    const routeId = parseRouteId(req.params.id);

    if (!routeId.valid) {
        return sendValidationError(res, [{ field: "id", issue: "must be a valid non-negative integer" }]);
    }

    if (req.accepts("application/json") === false) {
        return res.status(406).json({ message: "Unsupported response format" });
    }

    try {
        const authorData = await getAuthorById(routeId.value);

        if (!authorData) {
            return res.status(404).json({ message: "Author not found" });
        }

        return res.status(200).json(authorData);
    } catch (error) {
        console.error("GET /authors/:id failed:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const createAuthorHandler = async (req, res) => {
    if (!req.is("application/json")) {
        return res.status(415).json({ message: "Unsupported media type" });
    }

    if (req.accepts("application/json") === false) {
        return res.status(406).json({ message: "Unsupported response format" });
    }

    const authorData = req.body;
    const details = [];

    if (!authorData || typeof authorData !== "object" || Array.isArray(authorData)) {
        return sendValidationError(res, [{ field: "body", issue: "must be a JSON object" }]);
    }

    if (!isNonNegativeInteger(authorData.id)) {
        details.push({ field: "id", issue: "must be a non-negative integer" });
    }

    if (typeof authorData.name !== "string" || authorData.name.trim().length === 0) {
        details.push({ field: "name", issue: "must be a non-empty string" });
    }

    if (!isNonNegativeInteger(authorData.birth)) {
        details.push({ field: "birth", issue: "must be a non-negative integer" });
    }

    if (details.length > 0) {
        return sendValidationError(res, details);
    }

    try {
        const database = await getDb();
        const existingAuthor = await database.collection("authors").findOne({ id: authorData.id });

        if (existingAuthor) {
            return res.status(409).json({ message: "Author id already exists" });
        }

        const newAuthor = {
            id: authorData.id,
            name: authorData.name.trim(),
            birth: authorData.birth
        };

        const createdAuthor = await createAuthor(newAuthor);
        return res.status(201).json(createdAuthor);
    } catch (error) {
        console.error("POST /authors failed:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateAuthorByIdHandler = async (req, res) => {
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

    const allowedFields = ["name", "birth"];
    const updateFields = Object.keys(updates);

    if (updateFields.length === 0) {
        details.push({ field: "body", issue: "must contain at least one valid field to update" });
    }

    for (const field of updateFields) {
        if (!allowedFields.includes(field)) {
            details.push({ field, issue: "is not a valid update field" });
        }
    }

    if (Object.prototype.hasOwnProperty.call(updates, "name") && (typeof updates.name !== "string" || updates.name.trim().length === 0)) {
        details.push({ field: "name", issue: "must be a non-empty string" });
    }

    if (Object.prototype.hasOwnProperty.call(updates, "birth") && !isNonNegativeInteger(updates.birth)) {
        details.push({ field: "birth", issue: "must be a non-negative integer" });
    }

    if (details.length > 0) {
        return sendValidationError(res, details);
    }

    try {
        const database = await getDb();
        const existingAuthor = await database.collection("authors").findOne({ id: routeId.value });

        if (!existingAuthor) {
            return res.status(404).json({ message: "Author not found" });
        }

        const sanitizedUpdates = {};

        if (Object.prototype.hasOwnProperty.call(updates, "name")) {
            sanitizedUpdates.name = updates.name.trim();
        }

        if (Object.prototype.hasOwnProperty.call(updates, "birth")) {
            sanitizedUpdates.birth = updates.birth;
        }

        const updatedAuthor = await updateAuthorById(routeId.value, sanitizedUpdates);
        return res.status(200).json(updatedAuthor);
    } catch (error) {
        console.error("PUT /authors/:id failed:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteAuthorByIdHandler = async (req, res) => {
    const routeId = parseRouteId(req.params.id);

    if (!routeId.valid) {
        return sendValidationError(res, [{ field: "id", issue: "must be a valid non-negative integer" }]);
    }

    if (req.accepts("application/json") === false) {
        return res.status(406).json({ message: "Unsupported response format" });
    }

    try {
        const database = await getDb();
        const existingAuthor = await database.collection("authors").findOne({ id: routeId.value });

        if (!existingAuthor) {
            return res.status(404).json({ message: "Author not found" });
        }

        const relatedBook = await database.collection("books").findOne({ authorId: routeId.value });

        if (relatedBook) {
            return res.status(409).json({ message: "Author cannot be deleted because books still reference it" });
        }

        const deletedAuthor = await deleteAuthorById(routeId.value);
        return res.status(200).json(deletedAuthor);
    } catch (error) {
        console.error("DELETE /authors/:id failed:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export {
    getAuthorsHandler,
    getAuthorByIdHandler,
    createAuthorHandler,
    updateAuthorByIdHandler,
    deleteAuthorByIdHandler
};
