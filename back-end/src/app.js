import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));

app.use(cookieParser());

//Routes import
import healthcheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";
import todosRouter from "./routes/todos.routes.js";
import guestRouter from "./routes/guest.routes.js";

// Routes Declaration
const apiVersion = "/api/v1/";
app.use(`${apiVersion}healthcheck`, healthcheckRouter);
app.use(`${apiVersion}users`, userRouter);
app.use(`${apiVersion}todos`, todosRouter);
app.use(`${apiVersion}guest`, guestRouter);

export default app;
