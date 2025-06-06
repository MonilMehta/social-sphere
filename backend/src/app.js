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
import userRouter from "./routes/user.routes.js";
import searchRouter from "./routes/search.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";

// declare routes here
//health check route
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/replies", replyRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/follows", followRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/messages", messageRouter);

export { app };
