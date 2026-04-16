import type { LootKind, PerkId } from "@skyforge/shared";

export interface TankState {
  id: string;
  name: string;
  bot: boolean;
  hp: number;
  maxHp: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  turretAngle: number;
  adhesion: boolean;
  adhesionDisabledMs: number;
  coyoteMs: number;
  alive: boolean;
  selectedWeaponId: string;
  perks: PerkId[];
  weaponAmmo: Record<string, number>;
  cooldownMs: Record<string, number>;
}

export interface ProjectileState {
  id: string;
  ownerId: string;
  weaponId: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ttlMs: number;
  radius: number;
  damage: number;
  terrainDamage: number;
}

export interface LootState {
  id: string;
  kind: LootKind;
  x: number;
  y: number;
  consumed: boolean;
}

export interface MatchRuntime {
  tick: number;
  elapsedMs: number;
  hazardY: number;
  started: boolean;
  over: boolean;
  winnerId?: string;
}
