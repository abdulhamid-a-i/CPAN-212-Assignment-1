import express from "express";
import cors from "cors";

import workOrderRouter from "./routes/workorders.routes";
import { requestLog } from "./middleware/requestId.Logger.js";
import { authRequest } from "./middleware/auth.middleware.js";
import { AppError } from "./utils/apperror.js";
import { errorHandler } from "./middleware/errors.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLog);

app.get("/health", );

app.use("/api/workorders",authRequest, workOrderRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((req, res, next) => {
  next(new AppError(400, "NOT_FOUND", "Route not found"))
});

app.use(errorHandler)

export default app;
