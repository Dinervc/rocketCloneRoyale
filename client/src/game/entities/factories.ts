import { weapons } from "@skyforge/shared";
import type { LootState, ProjectileState, TankState } from "../core/state";

export function createTank(id: string, name: string, x: number, y: number, bot = false): TankState {
  return {
    id,
    name,
    bot,
    hp: 100,
    maxHp: 100,
    x,
    y,
    vx: 0,
    vy: 0,
    angle: 0,
    turretAngle: -Math.PI / 4,
    adhesion: false,
    adhesionDisabledMs: 0,
    coyoteMs: 0,
    alive: true,
    selectedWeaponId: "burst-rocket",
    perks: [],
    weaponAmmo: Object.fromEntries(weapons.map((w) => [w.id, w.ammo])),
    cooldownMs: Object.fromEntries(weapons.map((w) => [w.id, 0])),
  };
}

export function createProjectile(init: Omit<ProjectileState, "id">): ProjectileState {
  return {
    id: `${init.ownerId}-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    ...init,
  };
}

export function createLoot(kind: LootState["kind"], x: number, y: number): LootState {
  return {
    id: `loot-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    kind,
    x,
    y,
    consumed: false,
  };
}
