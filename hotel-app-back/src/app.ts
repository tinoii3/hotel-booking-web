import express from "express";
import apiRoutes from "./routes/index.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/", apiRoutes);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}/api`);
});