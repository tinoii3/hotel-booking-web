import express from "express";
import apiRoutes from "./routes/index.js";
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://your-frontend.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

app.use("/api/", apiRoutes);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}/api`);
});