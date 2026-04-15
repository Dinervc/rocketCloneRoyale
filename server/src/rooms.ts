import type { MatchMode, MatchPhase, PublicRoomState } from "@skyforge/shared";
import { randomUUID } from "node:crypto";
import type { WebSocket } from "ws";

export interface RoomPeer {
  id: string;
  ws: WebSocket;
  name: string;
  ready: boolean;
  bot: boolean;
}

export interface Room {
  code: string;
  mode: MatchMode;
  createdAt: number;
  hostId: string;
  phase: MatchPhase;
  peers: Map<string, RoomPeer>;
}

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const rooms = new Map<string, Room>();

function makeRoomCode(): string {
  let roomCode = "";
  for (let i = 0; i < 6; i += 1) roomCode += alphabet[Math.floor(Math.random() * alphabet.length)];
  return roomCode;
}

export function getOrCreateRoom(mode: MatchMode, explicitCode?: string): Room {
  const roomCode = explicitCode?.toUpperCase() ?? makeRoomCode();
  const existing = rooms.get(roomCode);
  if (existing) return existing;

  const room: Room = {
    code: roomCode,
    mode,
    createdAt: Date.now(),
    hostId: "",
    phase: { name: "prep", elapsedMs: 0, hazardLevel: 0 },
    peers: new Map(),
  };
  rooms.set(roomCode, room);
  return room;
}

export function addPeer(room: Room, ws: WebSocket, name: string): RoomPeer {
  const peer: RoomPeer = { id: randomUUID(), ws, name, ready: false, bot: false };
  room.peers.set(peer.id, peer);
  if (!room.hostId) room.hostId = peer.id;
  return peer;
}

export function removePeer(room: Room, peerId: string): void {
  room.peers.delete(peerId);
  if (!room.peers.size) {
    rooms.delete(room.code);
    return;
  }
  if (room.hostId === peerId) {
    room.hostId = Array.from(room.peers.keys())[0] ?? "";
  }
}

export function findRoom(code: string): Room | undefined {
  return rooms.get(code.toUpperCase());
}

export function roomState(room: Room): PublicRoomState {
  return {
    roomCode: room.code,
    hostId: room.hostId,
    players: Array.from(room.peers.values()).map((peer) => ({
      id: peer.id,
      name: peer.name,
      ready: peer.ready,
      bot: peer.bot,
    })),
    mode: room.mode,
    phase: room.phase,
  };
}
