# Books API Week 02 Spec - Version 2

## Feature 1: Book CRUD Operations and Author References

### Goal

Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Design Constraints

- This API uses custom integer IDs for books and authors, not MongoDB `_id` values.
- Book IDs and author IDs are unique within their collection.
- There is no endpoint for retrieving books by author. This is intentionally not included in the API scope for this version.

### Shared API Rules

#### Backend Validation

All route handlers must validate incoming data on the server before writing to the database. Validation is required for:

- required fields
- field types
- duplicate IDs
- invalid route parameters
- malformed numeric IDs
- duplicate records
- unsupported media types or content negotiation where applicable

If validation fails, the API must return a structured error object instead of a generic server error.

#### Error Object Structure

All error responses must include at least a `message` property. A `details` array is recommended when more specific validation feedback is useful.

Example error object:

    {
      "message": "Validation failed",
      "details": [
        {
          "field": "title",
          "issue": "must be a non-empty string"
        }
      ]
    }

#### Standard HTTP Status Codes

The API may use the following status codes:

- `200` OK
- `201` Created
- `204` No Content
- `400` Bad Request
- `404` Not Found
- `405` Method Not Allowed
- `406` Not Acceptable
- `409` Conflict
- `415` Unsupported Media Type
- `500` Internal Server Error

### Data Model

Book documents will be stored in the `books` collection.

Required book fields:

- `id`: int, required, custom id such as `1`
- `authorId`: int, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom integer IDs instead of MongoDB `_id` values for route parameters.

### Relationship to Authors

Each book will identify its author with an `authorId` field. The value of `authorId` is stored on the book document so the relationship is available, but the actual validation that the `authorId` matches an existing author document is deferred to Feature 2, after the `authors` collection exists.

This feature does not yet enforce referential integrity between the `books` and `authors` collections.

### Routes

#### GET /books

Purpose: Return all books.

Success:

- Status code: `200`
- Response body: an array of book objects

Errors:

- `406` if the client requests an unsupported response format
- `405` if the HTTP method is not supported for this route
- `500` if an unexpected server or database error occurs

#### GET /books/:id

Purpose: Return one book by its custom integer id.

Success:

- Status code: `200`
- Response body: the matching book object

Errors:

- `400` if the route parameter is not a valid integer id
- `404` if no book exists with that id
- `406` if the client requests an unsupported response format
- `405` if the HTTP method is not supported for this route
- `500` if an unexpected server or database error occurs

#### POST /books

Purpose: Create a new book.

Request body:

    {
      "id": 4,
      "authorId": 1,
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Validation requirements:

- `id` must be an integer
- `authorId` must be an integer
- `title` must be a non-empty string
- `publicationDate` must be a valid string date value
- duplicate `id` values are not allowed

Success:

- Status code: `201`
- Response body: the newly created book object

Errors:

- `400` if a required field is missing or invalid
- `409` if the `id` already exists
- `415` if the request uses an unsupported content type
- `406` if the client requests an unsupported response format
- `405` if the HTTP method is not supported for this route
- `500` if an unexpected server or database error occurs

#### PUT /books/:id

Purpose: Update an existing book.

This route supports partial updates. A request may include any subset of the editable fields, but at least one valid field must be supplied.

Editable fields:

- `authorId`
- `title`
- `publicationDate`

The `id` field is not editable through this route. If a client sends an `id` value in the request body, the API should reject it with `400`.

Request body examples:

    {
      "authorId": 2,
      "title": "Updated Book Title"
    }

    {
      "publicationDate": "2026-02-20"
    }

Success:

- Status code: `200`
- Response body: the updated book object

Errors:

- `400` if the route parameter is not a valid integer id
- `400` if the request body is empty or contains no valid update fields
- `400` if a provided `id` field is included in the body
- `400` if a required field is invalid or malformed
- `404` if no book exists with that id
- `406` if the client requests an unsupported response format
- `405` if the HTTP method is not supported for this route
- `415` if the request uses an unsupported content type
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id

Purpose: Delete an existing book.

Success:

- Status code: `200`
- Response body: the deleted book object before it is removed from the database

Errors:

- `400` if the route parameter is not a valid integer id
- `404` if no book exists with that id
- `406` if the client requests an unsupported response format
- `405` if the HTTP method is not supported for this route
- `500` if an unexpected server or database error occurs

### Swagger Documentation

Swagger must document every book route, including validation behavior and the error object format.

### Deployment Expectations

After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/swagger-docs` must allow someone to test every book route from the browser.

### Security Note (Deferred)

This feature does not yet address production security concerns around exposing write-capable routes in the Swagger UI. Because Swagger UI can send real HTTP requests, write operations such as `POST`, `PUT`, and `DELETE` should be reviewed and protected in a later update, such as by disabling Swagger in production or restricting mutating routes behind authentication and authorization.

---

## Feature 2: Author Collection and Functional CRUD Operations

### Goal

Add an author collection that stores author ids, names, and birth years. The API should provide all CRUD operations for this collection, with validation and referential integrity enforced on the backend.

### Data Model

Author documents will be stored in the `authors` collection.

Required author fields:

- `id`: int, required, custom id such as `1`
- `name`: string, required
- `birth`: int, required

Authors will also use custom integer IDs instead of MongoDB `_id` values for route parameters.

### Relationship to Books

Each author document has a custom `id` value that is referenced by the `authorId` field on book documents. The author `id` must be unique within the `authors` collection.

After the `authors` collection is implemented, the book create and update logic should validate that each book's `authorId` matches an existing author document. An author cannot be deleted while there are still books that reference that author. If an author is still associated with any books, the delete operation must fail.

### Routes

#### GET /authors

Purpose: Return all authors.

Success:

- Status code: `200`
- Response body: an array of author objects

Errors:

- `406` if the client requests an unsupported response format
- `405` if the HTTP method is not supported for this route
- `500` if an unexpected server or database error occurs

#### GET /authors/:id

Purpose: Return one author by its custom integer id.

Success:

- Status code: `200`
- Response body: the matching author object

Errors:

- `400` if the route parameter is not a valid integer id
- `404` if no author exists with that id
- `406` if the client requests an unsupported response format
- `405` if the HTTP method is not supported for this route
- `500` if an unexpected server or database error occurs

#### POST /authors

Purpose: Create a new author.

Request body:

    {
      "id": 4,
      "name": "Jane Doe",
      "birth": 1988
    }

Validation requirements:

- `id` must be an integer
- `name` must be a non-empty string
- `birth` must be an integer
- duplicate `id` values are not allowed

Success:

- Status code: `201`
- Response body: the newly created author object

Errors:

- `400` if a required field is missing or invalid
- `409` if the `id` already exists
- `415` if the request uses an unsupported content type
- `406` if the client requests an unsupported response format
- `405` if the HTTP method is not supported for this route
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id

Purpose: Update an existing author.

This route supports partial updates. A request may include any subset of the editable fields, but at least one valid field must be supplied.

Editable fields:

- `name`
- `birth`

The `id` field is not editable through this route. If a client sends an `id` value in the request body, the API should reject it with `400`.

Request body examples:

    {
      "name": "Jane Smith"
    }

    {
      "birth": 1990
    }

Success:

- Status code: `200`
- Response body: the updated author object

Errors:

- `400` if the route parameter is not a valid integer id
- `400` if the request body is empty or contains no valid update fields
- `400` if a provided `id` field is included in the body
- `400` if a required field is invalid or malformed
- `404` if no author exists with that id
- `406` if the client requests an unsupported response format
- `405` if the HTTP method is not supported for this route
- `415` if the request uses an unsupported content type
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id

Purpose: Delete an existing author.

Success:

- Status code: `200`
- Response body: the deleted author object before it is removed from the database

Delete rule:

- An author cannot be deleted if one or more books still reference that author ID.
- In this case, the API must reject the request with a `409 Conflict` error.

Errors:

- `400` if the route parameter is not a valid integer id
- `404` if no author exists with that id
- `409` if the author is still referenced by one or more books
- `406` if the client requests an unsupported response format
- `405` if the HTTP method is not supported for this route
- `500` if an unexpected server or database error occurs

### Swagger Documentation

Swagger must document every author route, including validation behavior and the error object format.

### Deployment Expectations

After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/swagger-docs` must allow someone to test every author route from the browser.

---

## General Validation and Error Handling Notes

### Duplicate and Invalid ID Handling

The following error behaviors must be consistent across both collections:

- Invalid route IDs, such as `/books/abc` or `/authors/-1`, must return `400 Bad Request`
- Duplicate custom IDs on create must return `409 Conflict`
- Missing records by ID must return `404 Not Found`

### Unsupported Requests

The API should return explicit validation or method errors when a client sends unsupported inputs or methods:

- `405` for wrong HTTP method on a route
- `406` for unsupported response format
- `415` for unsupported content type
- `400` for malformed or invalid request payloads

### Error Response Format Summary

The API should consistently return JSON error objects shaped like:

    {
      "message": "Author cannot be deleted because related books still exist"
    }

Additional details may be included as needed:

    {
      "message": "Validation failed",
      "details": [
        {
          "field": "birth",
          "issue": "must be an integer"
        }
      ]
    }

This contract ensures that client code can reliably interpret errors without guessing at the cause.
