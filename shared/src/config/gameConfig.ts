export interface PhysicsConfig {
  fixedDeltaMs: number;
  gravity: number;
  tractionForce: number;
  adhesionTorque: number;
  adhesionSnapDistance: number;
  detachmentImpulse: number;
  airControlForce: number;
  coyoteReattachMs: number;
}

export interface HazardConfig {
  initialY: number;
  risePerSecond: number;
  dps: number;
  adhesionDisableSeconds: number;
}

export const physicsConfig: PhysicsConfig = {
  fixedDeltaMs: 1000 / 60,
  gravity: 700,
  tractionForce: 460,
  adhesionTorque: 14,
  adhesionSnapDistance: 24,
  detachmentImpulse: 380,
  airControlForce: 130,
  coyoteReattachMs: 180,
};

export const hazardConfig: HazardConfig = {
  initialY: 980,
  risePerSecond: 24,
  dps: 18,
  adhesionDisableSeconds: 2.2,
};
