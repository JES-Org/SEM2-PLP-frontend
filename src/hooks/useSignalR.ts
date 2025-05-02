import * as signalR from "@microsoft/signalr";
import { useEffect, useState, useRef } from "react";

type MessageType = {
  text: string;
};

const useSignalR = (hubUrl: string) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl) 
      .withAutomaticReconnect() 
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = connection;
    setConnection(connection);

    connection
      .start()
      .then(() => {
        console.log("SignalR Connected.");
        setIsConnected(true);

        connection.on("ReceiveMessage", (message: string) => {
          setMessages((prevMessages) => [...prevMessages, { text: message }]);
        });
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));

    return () => {
      connection.stop();
    };
  }, [hubUrl]);

  return { connection: connectionRef.current, isConnected, messages };
};

export default useSignalR;
