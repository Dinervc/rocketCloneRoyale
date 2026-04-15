import type { ProjectileState, TankState } from "../core/state";
import { TerrainField } from "../terrain/TerrainField";
import { impulseTank } from "../physics/sim";

export interface ProjectileResult {
  damageEvents: Array<{ sourceId: string; targetId: string; amount: number }>;
  edits: Array<{ x: number; y: number; radius: number }>;
}

export function stepProjectiles(
  projectiles: ProjectileState[],
  tanks: TankState[],
  terrain: TerrainField,
  dtMs: number,
): ProjectileResult {
  const dt = dtMs / 1000;
  const edits: ProjectileResult["edits"] = [];
  const damageEvents: ProjectileResult["damageEvents"] = [];

  for (const p of projectiles) {
    p.vy += 480 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.ttlMs -= dtMs;

    const out = p.x < 0 || p.y < 0 || p.x > terrain.width || p.y > terrain.height;
    if (out || p.ttlMs <= 0 || terrain.isSolidAt(p.x, p.y)) {
      const radius = Math.max(12, p.radius * 2.4);
      edits.push({ x: p.x, y: p.y, radius });
      terrain.destroyCircle(p.x, p.y, radius);
      for (const t of tanks) {
        if (!t.alive) continue;
        const dx = t.x - p.x;
        const dy = t.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist <= radius * 1.7) {
          const scale = 1 - dist / (radius * 1.7);
          const dmg = Math.round(p.damage * scale);
          t.hp -= dmg;
          if (t.hp <= 0) {
            t.hp = 0;
            t.alive = false;
          }
          damageEvents.push({ sourceId: p.ownerId, targetId: t.id, amount: dmg });
          const nx = dx / Math.max(1, dist);
          const ny = dy / Math.max(1, dist);
          impulseTank(t, nx * 80 * scale, ny * 80 * scale);
        }
      }
      p.ttlMs = -1;
    }
  }

  for (let i = projectiles.length - 1; i >= 0; i -= 1) {
    if ((projectiles[i]?.ttlMs ?? 0) <= 0) projectiles.splice(i, 1);
  }

  return { damageEvents, edits };
}
