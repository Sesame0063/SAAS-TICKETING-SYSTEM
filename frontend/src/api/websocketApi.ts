export type WsEvent =
  | "comment_created"
  | "ticket_assigned"
  | "ticket_status_changed"
  | "notification_created";

export interface WsMessage {
  event: WsEvent;
  ticket_id?: string;
  notification_id?: string;
  data?: any;
}

let socket: WebSocket | null = null;
let connecting = false;

export function connectWebSocket(
  token: string,
  onMessage: (message: WsMessage) => void
) {
  if (!token || connecting || socket?.readyState === WebSocket.OPEN) {
    return socket;
  }

  connecting = true;

  socket = new WebSocket(`ws://127.0.0.1:8000/ws?token=${token}`);

  socket.onopen = () => {
    connecting = false;
    console.log("? WebSocket connected");
  };

  socket.onmessage = (event) => {
    onMessage(JSON.parse(event.data));
  };

  socket.onclose = () => {
    connecting = false;
    socket = null;
    console.log("?? WebSocket disconnected");
  };

  socket.onerror = () => {
    connecting = false;
    console.log("?? WebSocket handshake cancelled.");
  };

  return socket;
}

export function disconnectWebSocket() {
  if (!socket) return;

  if (socket.readyState === WebSocket.CONNECTING) {
    return;
  }

  socket.close();
  socket = null;
  connecting = false;
}
