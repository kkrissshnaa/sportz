import express from "express";
import http from "http";
import { matchRouter } from "../src/routes/matches.js";
import { attachWebSocketServer } from "../src/ws/server.js";
import { securityMiddleware } from "../src/arcjet.js";
import { commentaryRouter } from "../src/routes/commentary.js";

const PORT = Number(process.env.PORT || 8000);
const HOST = Number(process.env.HOST || "0.0.0.0");

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from express server!");
});

app.use(securityMiddleware());

app.use("/matches", matchRouter);
app.use("/matches/:id/commentary", commentaryRouter);

const { broadcastMatchCreated, broadcastCommentary } =
  attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastCommentary = broadcastCommentary;

server.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0" ? `http://${HOST}:${PORT}` : `http://localhost:${PORT}`;

  console.log(`server is running on ${baseUrl}`);
  console.log(
    `WebSocket Server is running on ${baseUrl.replace("http", "ws")}/ws`,
  );
});
