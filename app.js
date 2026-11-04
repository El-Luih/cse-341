//IMPORTS
import express from "express"

//INITIALIZERS
const app = express()

//MIDDLEWARE
app.use(express.json())

//ROUTES
app.get('/', (req, res) => {
    return res.status(200).json({ message : "Server is live"})
})

export default app