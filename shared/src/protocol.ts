import type { ID, MatchMode, PublicRoomState, SnapshotPayload, Vec2, WeaponCategory } from "./types";

export type ClientToServerMessage =
  | { type: "joinRoom"; roomCode?: string; playerName: string; mode: MatchMode }
  | { type: "ready"; ready: boolean }
  | { type: "inputCommand"; tick: number; move: -1 | 0 | 1; aim: Vec2; brake: boolean; utility: boolean }
  | { type: "fireWeapon"; tick: number; weaponId: string; aim: Vec2 }
  | { type: "switchWeapon"; weaponId: string; category: WeaponCategory }
  | { type: "pong"; sentAt: number }
  | { type: "iceCandidate"; targetId: ID; candidate: RTCIceCandidateInit }
  | { type: "sessionDescription"; targetId: ID; description: RTCSessionDescriptionInit };

export type ServerToClientMessage =
  | { type: "joinAccepted"; selfId: ID; roomState: PublicRoomState }
  | { type: "roomState"; roomState: PublicRoomState }
  | { type: "snapshot"; snapshot: SnapshotPayload }
  | { type: "damageEvent"; sourceId: ID; targetId: ID; amount: number; at: Vec2 }
  | { type: "terrainEdit"; eventId: string; center: Vec2; radius: number; strength: number }
  | { type: "lootSpawn"; lootId: ID; position: Vec2; kind: string }
  | { type: "lootPickup"; byId: ID; lootId: ID }
  | { type: "playerEliminated"; id: ID; byId?: ID }
  | { type: "matchPhase"; roomState: PublicRoomState }
  | { type: "gameOver"; winnerId?: ID; standings: ID[] }
  | { type: "ping"; sentAt: number }
  | { type: "peerAnnounce"; peerId: ID; polite: boolean }
  | { type: "iceCandidate"; peerId: ID; candidate: RTCIceCandidateInit }
  | { type: "sessionDescription"; peerId: ID; description: RTCSessionDescriptionInit }
  | { type: "error"; message: string };

export function safeParseMessage<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
