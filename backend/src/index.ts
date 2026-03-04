import express from "express";
import cors from "cors";
import path from "path";
import responsesRouter from "./routes/responses";

const app = express();
const PORT = parseInt(process.env.PORT || "8080", 10);

app.use(cors());
app.use(express.json());

app.use("/api/responses", responsesRouter);

// Serve the React frontend static files
const staticDir = path.join(__dirname, "../../frontend/dist");
app.use(express.static(staticDir));
app.get("*", (_req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
