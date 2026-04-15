import { hazardConfig } from "@skyforge/shared";
import type { TankState } from "../core/state";
import { TerrainField } from "../terrain/TerrainField";

export function stepHazard(tanks: TankState[], elapsedMs: number, terrain: TerrainField): number {
  const hazardY = hazardConfig.initialY - (elapsedMs / 1000) * hazardConfig.risePerSecond;
  for (const t of tanks) {
    if (!t.alive) continue;
    if (t.y > hazardY) {
      t.hp = Math.max(0, t.hp - hazardConfig.dps / 60);
      if (t.hp === 0) t.alive = false;
      t.adhesionDisabledMs = Math.max(t.adhesionDisabledMs, 120);
    }
  }
  if (elapsedMs % 3000 < 20) terrain.dissolveBelow(hazardY + 40);
  return hazardY;
}
