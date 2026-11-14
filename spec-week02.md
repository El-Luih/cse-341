# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal

Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model

Book documents will be stored in the `books` collection.

Required book fields:

- `id`: int, required, custom id such as `1`
- `authorId`: int, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom integer ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors

Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books

Purpose: Return all books.

Success:

- Status code: `200`
- Response body: an array of book objects

Errors:

- `500` if an unexpected server or database error occurs

#### GET /books/:id

Purpose: Return one book by its custom id.

Success:

- Status code: `200`
- Response body: the matching book object

Errors:

- `404` if no book exists with that id
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

Success:

- Status code: `201`
- Response body: the newly created book object

Errors:

- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id

Purpose: Update an existing book.

Request body:

    {
      "authorId": 2,
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:

- Status code: `200`
- Response body: the updated book object

Errors:

- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id

Purpose: Delete an existing book.

Success:

- Status code: `204`
- Response body: none

Errors:

- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation

Swagger must document every book route.

### Deployment Expectations

After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/swagger-docs` must allow someone to test every book route from the browser.

## Feature 2: Author Collection and Functional CRUD Operations

### Goal

Add an author collection that stores author ids, names, and birth years. The API should provide all CRUD operations for this collection.

### Data Model

Author documents will be stored in the `authors` collection.

Required author fields:

- `id`: int, required, custom id such as `1`
- `name`: string, required
- `birth`: int, required

Authors will also use custom integer ids instead of MongoDB `_id` values for route parameters.

### Relationship to Books

Each author document has a custom `id` value that is referenced by the `authorId` field on book documents. The author `id` must be unique within the `authors` collection, and each book's `authorId` must match an existing author document.

### Routes

#### GET /authors

Purpose: Return all authors.

Success:

- Status code: `200`
- Response body: an array of author objects

Errors:

- `500` if an unexpected server or database error occurs

#### GET /authors/:id

Purpose: Return one author by its custom id.

Success:

- Status code: `200`
- Response body: the matching author object

Errors:

- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors

Purpose: Create a new author.

Request body:

    {
      "id": 4,
      "name": "Jane Doe",
      "birth": 1988
    }

Success:

- Status code: `201`
- Response body: the newly created author object

Errors:

- `400` if a required field is missing
- `400` if the `id` already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id

Purpose: Update an existing author.

Request body:

    {
      "name": "Jane Smith",
      "birth": 1990
    }

Success:

- Status code: `200`
- Response body: the updated author object

Errors:

- `400` if a required field is missing
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id

Purpose: Delete an existing author.

Success:

- Status code: `204`
- Response body: none

Errors:

- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation

Swagger must document every author route.

### Deployment Expectations

After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/swagger-docs` must allow someone to test every author route from the browser.
