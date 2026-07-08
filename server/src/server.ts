import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";

const app: Application = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "⭐ api is alive" });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
