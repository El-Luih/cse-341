import express from "express";
import {
    getBooksHandler,
    getBookByIdHandler,
    createBookHandler,
    updateBookByIdHandler,
    deleteBookByIdHandler
} from "./controllers/books.js";

const router = express.Router();

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Return every book in the collection
 *     description: Book-only feature scope. Author referential validation is intentionally deferred to a later update.
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Books returned successfully
 *       406:
 *         description: Unsupported response format
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new book
 *     description: Book-only feature scope. This does not yet validate that authorId matches an existing author document.
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, authorId, title, publicationDate]
 *             properties:
 *               id:
 *                 type: integer
 *               authorId:
 *                 type: integer
 *               title:
 *                 type: string
 *               publicationDate:
 *                 type: string
 *             example:
 *               id: 4
 *               authorId: 1
 *               title: Example Book Title
 *               publicationDate: 2026-01-15
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Duplicate book id
 *       415:
 *         description: Unsupported media type
 *       500:
 *         description: Internal server error
 */
router.get("/books", getBooksHandler);
router.post("/books", createBookHandler);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Return a single book by custom integer id
 *     description: Book-only feature scope. Author validation for related records is deferred to a later update.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       400:
 *         description: Invalid route parameter
 *       404:
 *         description: Book not found
 *       406:
 *         description: Unsupported response format
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update an existing book using partial update semantics
 *     description: Book-only feature scope. This route does not yet validate that authorId matches an existing author document.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorId:
 *                 type: integer
 *               title:
 *                 type: string
 *               publicationDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Book not found
 *       415:
 *         description: Unsupported media type
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a book by custom integer id
 *     description: Book-only feature scope. The deleted record is returned before removal, as required for this issue.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book deleted successfully and the deleted record was returned
 *       400:
 *         description: Invalid route parameter
 *       404:
 *         description: Book not found
 *       406:
 *         description: Unsupported response format
 *       500:
 *         description: Internal server error
 */
router.get("/books/:id", getBookByIdHandler);
router.put("/books/:id", updateBookByIdHandler);
router.delete("/books/:id", deleteBookByIdHandler);

export default router;