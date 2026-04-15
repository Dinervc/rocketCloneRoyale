import type { TankState } from "../core/state";

export interface BotDecision {
  move: -1 | 0 | 1;
  fire: boolean;
  utility: boolean;
  aimX: number;
  aimY: number;
}

export function chooseTarget(self: TankState, tanks: TankState[]): TankState | undefined {
  return tanks
    .filter((t) => t.id !== self.id && t.alive)
    .sort((a, b) => Math.hypot(a.x - self.x, a.y - self.y) - Math.hypot(b.x - self.x, b.y - self.y))[0];
}

export function chooseWeapon(self: TankState, distance: number): string {
  if (distance > 360) return "rail-spark";
  if (distance < 120) return "scatter-pods";
  if (self.y > 600) return "blink-thruster";
  return "impact-shell";
}

export function estimateShotSolution(self: TankState, target: TankState): { aimX: number; aimY: number } {
  const lead = 0.32;
  const tx = target.x + target.vx * lead;
  const ty = target.y + target.vy * lead;
  return { aimX: tx - self.x, aimY: ty - self.y };
}

export function chooseMovementGoal(self: TankState, hazardY: number): -1 | 0 | 1 {
  if (self.y > hazardY - 120) return -1;
  return Math.random() < 0.03 ? (Math.random() > 0.5 ? 1 : -1) : 0;
}

export function recoverFromAirborne(self: TankState): boolean {
  return !self.adhesion && self.vy > 120;
}

export function escapeHazard(self: TankState, hazardY: number): boolean {
  return self.y > hazardY - 80;
}

export function decideBotInput(self: TankState, tanks: TankState[], hazardY: number): BotDecision {
  const target = chooseTarget(self, tanks);
  if (!target) return { move: 0, fire: false, utility: false, aimX: 1, aimY: 0 };
  const distance = Math.hypot(target.x - self.x, target.y - self.y);
  self.selectedWeaponId = chooseWeapon(self, distance);
  const aim = estimateShotSolution(self, target);
  const move = chooseMovementGoal(self, hazardY);
  const utility = escapeHazard(self, hazardY) || recoverFromAirborne(self);
  return {
    move,
    fire: Math.random() < 0.04,
    utility,
    aimX: aim.aimX,
    aimY: aim.aimY,
  };
}
