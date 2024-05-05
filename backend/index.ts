import express from "express";
import { WebSocket, WebSocketServer } from "ws";

const app = express();
app.get("/", (request, response) => {
  response.send("Hi There!");
});
const httpServer = app.listen(8080);

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", function (socket) {
  socket.on("error", (err) => console.error(err));

  socket.on("message", function (data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
  socket.send("Hi! Message From Server!");
});
