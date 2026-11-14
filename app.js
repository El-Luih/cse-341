//IMPORTS
import express from "express";
import router from "./src/router.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };

//INITIALIZERS
const app = express();

//MIDDLEWARE
app.use(express.json());
app.use(router);
app.use("/swagger-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//ROUTES
app.get('/', (req , res) => {
    return res.status(200).json({ message: "Server is live" });
});



export default app;