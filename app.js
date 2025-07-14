import express from "express";
import dotenv from "dotenv";
import { Socket } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
