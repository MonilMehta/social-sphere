import express from "express";

const app = express();

app.use(express.static("public"))

// import and declare routes here

export { app }