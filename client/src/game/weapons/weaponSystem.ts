import { weapons } from "@skyforge/shared";
import type { ProjectileState, TankState } from "../core/state";
import { createProjectile } from "../entities/factories";
import { impulseTank } from "../physics/sim";

const defs = new Map(weapons.map((w) => [w.id, w]));

export function cycleWeapon(tank: TankState, delta: number): void {
  if (delta === 0) return;
  const idx = weapons.findIndex((w) => w.id === tank.selectedWeaponId);
  const next = (idx + delta + weapons.length) % weapons.length;
  tank.selectedWeaponId = weapons[next]?.id ?? tank.selectedWeaponId;
}

export function tryFire(tank: TankState, aimX: number, aimY: number): ProjectileState[] {
  const def = defs.get(tank.selectedWeaponId);
  if (!def || tank.cooldownMs[def.id] > 0 || tank.weaponAmmo[def.id] <= 0 || !tank.alive) return [];

  tank.weaponAmmo[def.id] -= 1;
  tank.cooldownMs[def.id] = def.cooldownMs;

  const mag = Math.max(0.001, Math.hypot(aimX, aimY));
  const dx = aimX / mag;
  const dy = aimY / mag;
  tank.turretAngle = Math.atan2(dy, dx);

  if (def.id === "blink-thruster") {
    impulseTank(tank, -dx * def.recoil * 1.5, -dy * def.recoil * 1.5);
    return [];
  }

  const pellets = def.pellets ?? 1;
  const spread = def.spreadRad ?? 0;
  const result: ProjectileState[] = [];
  for (let i = 0; i < pellets; i += 1) {
    const offset = pellets === 1 ? 0 : ((i / (pellets - 1)) - 0.5) * spread;
    const a = Math.atan2(dy, dx) + offset;
    const vx = Math.cos(a) * def.projectileSpeed;
    const vy = Math.sin(a) * def.projectileSpeed;
    result.push(
      createProjectile({
        ownerId: tank.id,
        weaponId: def.id,
        x: tank.x + dx * 18,
        y: tank.y + dy * 18,
        vx,
        vy,
        ttlMs: def.id === "arc-mine" ? 6000 : 3000,
        radius: Math.max(4, def.blastRadius * 0.2),
        damage: 18 + def.blastRadius * 0.4,
        terrainDamage: def.terrainDamage,
      }),
    );
  }

  impulseTank(tank, -dx * def.recoil, -dy * def.recoil * 0.85);
  return result;
}
