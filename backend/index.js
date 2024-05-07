const url = require("url");
const http = require("http");
const uuid = require("uuid");
const { WebSocketServer } = require("ws");

const port = process.env.PORT || 8000;
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const connections = {};
const users = {};

const broadcast = () => {
  Object.keys(connections).forEach((id) => {
    const connection = connections[id];
    const message = JSON.stringify(users);
    connection.send(message);
  });
};

const handleMessage = (bytes, id) => {
  const message = JSON.parse(bytes.toString());
  const user = users[id];
  user.state = message;
  broadcast();
  // console.log(
  //   `${user.username} updated their state:${JSON.stringify(user.state)}`
  // );
};

const handleClose = (id) => {
  console.log(`${users[id].username} disconnected`);
  delete connections[id];
  delete users[id];

  broadcast();
};

wsServer.on("connection", function (connection, request) {
  const id = uuid.v4();
  const { username } = url.parse(request.url, true).query;
  connections[id] = connection;
  users[id] = {
    username: username,
    state: {},
  };

  connection.on("error", (err) => console.error(err));
  connection.on("message", (message) => handleMessage(message, id));
  connection.on("close", () => handleClose(id));
});

server.listen(port, () =>
  console.log(`WebSocket server is running on port ${port}`)
);
