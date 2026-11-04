//IMPORTS
import app from "./app.js"

//INITIALIZERS
const PORT = process.env.PORT

//ERROR HANDLING
if (!PORT) {
    throw new Error("PORT values is missing. Your .env files is not being read properly.")
}

//STARTING
app.listen(PORT, function () {
    console.log(`Server is listening at local port ${PORT}`)
})
