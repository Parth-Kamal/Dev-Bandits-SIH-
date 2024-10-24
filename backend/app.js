import compression from "compression";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import auth from "./routes/auth.js";

const app = express();

app.use(morgan("dev"));

app.use(cors());

app.use(express.json());

app.use(compression());

app.use("/auth", auth);

app.all("*", (req, res) => {
   res.status(404).json({
      message: `Can't find ${req.originalUrl} on this server!`,
   });
});

export default app;
