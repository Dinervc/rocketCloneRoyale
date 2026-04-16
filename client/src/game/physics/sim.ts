import { physicsConfig } from "@skyforge/shared";
import Phaser from "phaser";
import type { TankState } from "../core/state";
import { TerrainField } from "../terrain/TerrainField";

export function applyTankPhysics(
  tank: TankState,
  moveInput: -1 | 0 | 1,
  braking: boolean,
  terrain: TerrainField,
  dtMs: number,
): void {
  if (!tank.alive) return;

  const dt = dtMs / 1000;
  tank.cooldownMs = Object.fromEntries(Object.entries(tank.cooldownMs).map(([k, v]) => [k, Math.max(0, v - dtMs)]));

  const snap = terrain.snapToSurface(tank.x, tank.y + 8, physicsConfig.adhesionSnapDistance);
  if (tank.adhesionDisabledMs > 0) {
    tank.adhesionDisabledMs -= dtMs;
  } else if (snap.hit || tank.coyoteMs > 0) {
    tank.adhesion = true;
    if (snap.hit) {
      tank.coyoteMs = physicsConfig.coyoteReattachMs;
      tank.x = snap.x;
      tank.y = snap.y;
      const targetAngle = Math.atan2(snap.ny, snap.nx) + Math.PI / 2;
      const delta = Phaser.Math.Angle.Wrap(targetAngle - tank.angle);
      tank.angle += delta * Math.min(1, dt * physicsConfig.adhesionTorque);
      const tx = snap.ny;
      const ty = -snap.nx;
      const traction = physicsConfig.tractionForce * (braking ? 0.3 : 1);
      tank.vx += tx * moveInput * traction * dt;
      tank.vy += ty * moveInput * traction * dt;
      tank.vx *= braking ? 0.88 : 0.98;
      tank.vy *= braking ? 0.88 : 0.98;
    }
  } else {
    tank.adhesion = false;
  }

  if (!tank.adhesion) {
    tank.vy += physicsConfig.gravity * dt;
    tank.vx += moveInput * physicsConfig.airControlForce * dt;
    tank.coyoteMs = Math.max(0, tank.coyoteMs - dtMs);
  }

  tank.x += tank.vx * dt;
  tank.y += tank.vy * dt;

  tank.x = Phaser.Math.Clamp(tank.x, 0, terrain.width);
}

export function impulseTank(tank: TankState, ix: number, iy: number): void {
  tank.vx += ix;
  tank.vy += iy;
  const impulse = Math.hypot(ix, iy);
  if (impulse > physicsConfig.detachmentImpulse) {
    tank.adhesion = false;
    tank.adhesionDisabledMs = 220;
  }
}
