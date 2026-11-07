//IMPORTS
import app from "./app.js";
import { connectToDb } from "./src/db/connect.js";

//INITIALIZERS
const PORT = process.env.PORT;

//ERROR HANDLING
if (!PORT) {
    throw new Error("PORT values is missing. Your .env files is not being read properly.");
};

//STARTING
const startServer = async () => {
    try {
        await connectToDb();
        app.listen(PORT, () => {
            console.log(`Server is listening at local port ${PORT}`);
        });
    } catch (error) {
        console.error("Could not connect to database: ", error.message);
        process.exit(1);
    };
};

await startServer();
