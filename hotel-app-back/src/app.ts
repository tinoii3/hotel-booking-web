import express from "express";
import apiRoutes from "./routes/index.js";
import path from "path";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/", apiRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'assets', 'uploads')));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}/api`);
});