import express from "express";
import cors from "cors";
import { addBlock, getBlockchain } from "./controllers/BockChainController";

const PORT = 8080;
const app = express();

app.use(cors());
app.use(express.json());

// Routes

app.get("/", getBlockchain);
app.post("/", addBlock);

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
