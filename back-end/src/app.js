import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const productionOrigins = [process.env.PROD_ORIGIN1].filter(Boolean);
const devOrigins = [process.env.DEV_ORIGIN1].filter(Boolean);

const allowedOrigins =
  process.env.NODE_ENV === "production" ? productionOrigins : devOrigins;

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
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
