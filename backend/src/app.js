import express from "express";
import cors from "cors";

import workOrderRouter from "./routes/workorders.routes";
import { requestLog } from "./middleware/requestId.Logger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLog);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/workorders", workOrderRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
