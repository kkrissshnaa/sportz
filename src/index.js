import express from "express";
import http from "http";
import { matchRouter } from "../src/routes/matches.js";
import { attachWebSocketServer } from "../src/ws/server.js";

const PORT = Number(process.env.PORT || 8000);
const HOST = Number(process.env.HOST || "0.0.0.0");

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from express server!");
});

app.use("/matches", matchRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0" ? `http://${HOST}:${PORT}` : `http://localhost:${PORT}`;

  console.log(`server is running on ${baseUrl}`);
  console.log(
    `WebSocket Server is running on ${baseUrl.replace("http", "ws")}/ws`,
  );
});
