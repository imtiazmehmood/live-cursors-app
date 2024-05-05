import { useEffect, useState } from "react";

function App() {
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [latestMessage, setLatestMessage] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws:localhost:8080");
    socket.onopen = () => {
      console.log("Connect");
    };
    socket.onmessage = (message) => {
      console.log("Received Message", message.data);
      setLatestMessage(message.data);
    };
    setSocket(socket);

    return () => {
      socket.close();
    };
  }, []);
  if (!socket) {
    <div className=" flex flex-col justify-center items-center text-green-400">
      Connecting To Socket Server...
    </div>;
  }
  return (
    <div className=" flex flex-col justify-center items-center text-green-400">
      {latestMessage}
    </div>
  );
}

export default App;
