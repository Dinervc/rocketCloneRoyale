import type { ClientToServerMessage, ServerToClientMessage } from "@skyforge/shared";
import { safeParseMessage } from "@skyforge/shared";
import { WebSocketServer } from "ws";
import type { WebSocket } from "ws";
import { encode } from "./protocol";
import { addPeer, findRoom, getOrCreateRoom, removePeer, roomState, type Room } from "./rooms";

const PORT = Number(process.env.PORT ?? 8787);
const wss = new WebSocketServer({ port: PORT });

type Session = { room: Room; peerId: string };
const sessions = new WeakMap<WebSocket, Session>();

function send(ws: WebSocket, message: ServerToClientMessage): void {
  if (ws.readyState === ws.OPEN) ws.send(encode(message));
}

function broadcast(room: Room, message: ServerToClientMessage): void {
  room.peers.forEach((peer) => send(peer.ws, message));
}

wss.on("connection", (ws) => {
  ws.on("message", (buffer) => {
    const payload = safeParseMessage<ClientToServerMessage>(String(buffer));
    if (!payload) {
      send(ws, { type: "error", message: "Malformed JSON message" });
      return;
    }

    const session = sessions.get(ws);

    if (payload.type === "joinRoom") {
      const room = payload.roomCode ? findRoom(payload.roomCode) ?? getOrCreateRoom(payload.mode, payload.roomCode) : getOrCreateRoom(payload.mode);
      const peer = addPeer(room, ws, payload.playerName.slice(0, 24));
      sessions.set(ws, { room, peerId: peer.id });
      send(ws, { type: "joinAccepted", selfId: peer.id, roomState: roomState(room) });
      room.peers.forEach((other) => {
        if (other.id !== peer.id) {
          send(other.ws, { type: "peerAnnounce", peerId: peer.id, polite: false });
          send(ws, { type: "peerAnnounce", peerId: other.id, polite: true });
        }
      });
      broadcast(room, { type: "roomState", roomState: roomState(room) });
      return;
    }

    if (!session) {
      send(ws, { type: "error", message: "Join room first" });
      return;
    }

    const room = session.room;
    const peer = room.peers.get(session.peerId);
    if (!peer) return;

    switch (payload.type) {
      case "ready":
        peer.ready = payload.ready;
        broadcast(room, { type: "roomState", roomState: roomState(room) });
        break;
      case "sessionDescription":
        room.peers.get(payload.targetId)?.ws.send(encode({ type: "sessionDescription", peerId: peer.id, description: payload.description }));
        break;
      case "iceCandidate":
        room.peers.get(payload.targetId)?.ws.send(encode({ type: "iceCandidate", peerId: peer.id, candidate: payload.candidate }));
        break;
      case "pong":
      case "inputCommand":
      case "switchWeapon":
      case "fireWeapon":
        // Host-authoritative simulation is exchanged over WebRTC data channels.
        break;
      default:
        break;
    }
  });

  const pingTimer = setInterval(() => {
    send(ws, { type: "ping", sentAt: Date.now() });
  }, 5000);

  ws.on("close", () => {
    clearInterval(pingTimer);
    const session = sessions.get(ws);
    if (!session) return;
    removePeer(session.room, session.peerId);
    broadcast(session.room, { type: "roomState", roomState: roomState(session.room) });
  });
});

console.log(`Skyforge signaling server listening on :${PORT}`);
