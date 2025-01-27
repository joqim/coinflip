import { WebSocketMessageHandler } from "./types";
export function createWebSocket(
  url: string,
  messageHandler: WebSocketMessageHandler
): WebSocket {
  const ws = new WebSocket(url);

  // Handling incoming messages
  ws.onmessage = (message) => {
    if (typeof message.data === 'string') {
      try {
        const data = JSON.parse(message.data);
        messageHandler(data);
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    } else {
      console.error('WebSocket message is not a valid string');
    }
  };

  // Handling WebSocket errors
  ws.onerror = (err) => {
    console.warn('WebSocket error:', err);
  };

  // Handling WebSocket closure
  ws.onclose = (event) => {
    console.log('WebSocket connection closed', event);
  };

  return ws;
}
