import type { MatchRuntime, TankState } from "../core/state";

export function updateMatch(runtime: MatchRuntime, tanks: TankState[]): void {
  runtime.tick += 1;
  runtime.elapsedMs += 1000 / 60;
  const alive = tanks.filter((t) => t.alive);
  if (!runtime.over && alive.length <= 1) {
    runtime.over = true;
    runtime.winnerId = alive[0]?.id;
  }
}
