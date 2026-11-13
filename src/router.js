import express from "express";
import { getBooksHandler, getBookByIdHandler } from "./controllers/books.js";

const router = express.Router();

/**
 * @openapi
 * /books:
 *  get:
 *      summary: Get an array of all existing books and their details
 *      tags:
 *        - Books
 *      responses:
 *          200:
 *              description: All books returned succesfully
 *          500:
 *              description: Internal server error
 */
router.get("/books", getBooksHandler);

/**
 * @openapi
 * /books/{id}:
 *  get:
 *      summary: Gets the information of a particular book filtered by its id property
 *      tags:
 *        - Books
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *              type: string
 *      responses: 
 *          200:
 *              description: Book returned succesfully
 *          404:
 *              description: Book not found
 *          500:
 *              description: Internal server error
 */
router.get("/books/:id", getBookByIdHandler);

export default router;