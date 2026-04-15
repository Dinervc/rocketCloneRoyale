export type ID = string;

export interface Vec2 {
  x: number;
  y: number;
}

export interface TankSnapshot {
  id: ID;
  name: string;
  bot: boolean;
  hp: number;
  alive: boolean;
  teamId?: ID;
  position: Vec2;
  velocity: Vec2;
  angle: number;
  turretAngle: number;
  adhesion: boolean;
  selectedWeaponId: string;
}

export interface ProjectileSnapshot {
  id: ID;
  ownerId: ID;
  weaponId: string;
  position: Vec2;
  velocity: Vec2;
  ttl: number;
}

export interface LootSnapshot {
  id: ID;
  kind: LootKind;
  position: Vec2;
  consumed: boolean;
}

export type MatchMode =
  | "solo-survival"
  | "duos"
  | "squads"
  | "team-skirmish"
  | "zero-g-lab"
  | "hyperballistics"
  | "sudden-spark"
  | "mine-mayhem"
  | "private-custom";

export type HazardType = "plasma-tide" | "storm-ring" | "lava-surge" | "corrosive-fog";

export type LootKind =
  | "repair-capsule"
  | "ammo-cache"
  | "overcharge-cell"
  | "salvage-magnet"
  | "double-thruster"
  | "shock-anchor"
  | "phase-glider";

export type WeaponCategory = "burst" | "impact" | "cluster" | "utility" | "control" | "precision";

export type PerkId =
  | "reinforced-hull"
  | "traction-kit"
  | "scavenger-field"
  | "tactical-scanner"
  | "overclock-reactor"
  | "shock-mounts"
  | "reserve-bay"
  | "heat-sinks"
  | "aerial-stabilizers";

export interface MatchPhase {
  name: "prep" | "mid" | "surge" | "finale";
  elapsedMs: number;
  hazardLevel: number;
}

export interface PublicRoomState {
  roomCode: string;
  hostId: ID;
  players: Array<{ id: ID; name: string; ready: boolean; bot: boolean }>;
  mode: MatchMode;
  phase: MatchPhase;
}

export interface SnapshotPayload {
  tick: number;
  tanks: TankSnapshot[];
  projectiles: ProjectileSnapshot[];
  loot: LootSnapshot[];
  hazardY: number;
  aliveCount: number;
  terrainEditsApplied: number;
}
