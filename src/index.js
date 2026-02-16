import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());

server.get("/health", async (req, res) => {
  res.status(200).json({ message: "Server is in good health" });
});

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`Server is running at: http://locathost:${PORT}`);
});
