import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "✨ API is alive" });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
