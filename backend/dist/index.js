"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const app = (0, express_1.default)();
app.get("/", (request, response) => {
    response.send("Hi There!");
});
const httpServer = app.listen(8080);
const wss = new ws_1.WebSocketServer({ server: httpServer });
wss.on("connection", function (socket) {
    socket.on("error", (err) => console.error(err));
    socket.on("message", function (data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
    socket.send("Hi! Message From Server!");
});
