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
import replyRouter from "./routes/reply.routes.js";
import likeRouter from "./routes/like.routes.js";
import followRouter from "./routes/follow.routes.js";
import registerRouter from "./routes/register.routes.js";
import loginRouter from "./routes/login.routes.js";
import refreshTokenRouter from "./routes/refresh.routes.js";
import logoutRouter from "./routes/logout.routes.js";
// declare routes here
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/replies", replyRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/follows", followRouter);
app.use("/api/v1/register",registerRouter);
app.use("api/v1/login",loginRouter);
app.use("api/v1/refresh",refreshTokenRouter);
app.use("api/v1/logout",logoutRouter);
app.use(verifyJWT);//JWT middleware

export { app };
