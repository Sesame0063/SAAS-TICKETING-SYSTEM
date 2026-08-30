import { useEffect, useRef } from "react";

const WS_URL = import.meta.env.VITE_WS_URL;

export default function useWebSocket(onMessage: (event: any) => void) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const socket = new WebSocket(`${WS_URL}?token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => console.log("WebSocket Connected");

    socket.onmessage = (event) => {
      try {
        onMessage(JSON.parse(event.data));
      } catch (err) {
        console.error("Invalid WS message", err);
      }
    };

    socket.onerror = (err) => console.error("WebSocket Error", err);

    socket.onclose = () => console.log("WebSocket Disconnected");

    return () => socket.close();
  }, [onMessage]);

  return socketRef.current;
}

