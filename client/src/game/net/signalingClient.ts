import type { ClientToServerMessage, ServerToClientMessage } from "@skyforge/shared";
import { safeParseMessage } from "@skyforge/shared";

export class SignalingClient {
  private ws?: WebSocket;
  onMessage?: (message: ServerToClientMessage) => void;

  connect(url: string): void {
    this.ws = new WebSocket(url);
    this.ws.addEventListener("message", (event) => {
      const parsed = safeParseMessage<ServerToClientMessage>(String(event.data));
      if (parsed) this.onMessage?.(parsed);
    });
  }

  send(message: ClientToServerMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }
}
