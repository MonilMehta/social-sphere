import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.static("public"));

app.use(express.json());

// import routes here
import postRouter from "./routes/post.routes.js";
import commentRouter from "./routes/comment.routes.js";

// declare routes here
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);

export { app };
