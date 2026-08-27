import { useEffect, useRef } from "react";
import {
  connectWebSocket,
  disconnectWebSocket,
  type WsMessage,
} from "../api/websocketApi";

export default function useWebSocket(
  onMessage: (message: WsMessage) => void
) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const token = localStorage.getItem("access_token");
    if (!token) return;

    initialized.current = true;

    connectWebSocket(token, onMessage);

    return () => {
      disconnectWebSocket();
      initialized.current = false;
    };
  }, [onMessage]);
}