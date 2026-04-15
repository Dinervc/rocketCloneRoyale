import type { WeaponCategory } from "../types";

export interface WeaponDef {
  id: string;
  name: string;
  category: WeaponCategory;
  cooldownMs: number;
  ammo: number;
  projectileSpeed: number;
  blastRadius: number;
  terrainDamage: number;
  recoil: number;
  pellets?: number;
  spreadRad?: number;
  utility?: boolean;
}

export const weapons: WeaponDef[] = [
  { id: "burst-rocket", name: "Burst Rocket", category: "burst", cooldownMs: 850, ammo: 18, projectileSpeed: 440, blastRadius: 32, terrainDamage: 26, recoil: 52, pellets: 3, spreadRad: 0.12 },
  { id: "impact-shell", name: "Impact Shell", category: "impact", cooldownMs: 1300, ammo: 10, projectileSpeed: 520, blastRadius: 46, terrainDamage: 42, recoil: 84 },
  { id: "scatter-pods", name: "Scatter Pods", category: "cluster", cooldownMs: 1200, ammo: 9, projectileSpeed: 380, blastRadius: 22, terrainDamage: 18, recoil: 58, pellets: 6, spreadRad: 0.35 },
  { id: "tunnel-lance", name: "Tunnel Lance", category: "utility", cooldownMs: 900, ammo: 12, projectileSpeed: 560, blastRadius: 14, terrainDamage: 65, recoil: 36, utility: true },
  { id: "arc-mine", name: "Arc Mine", category: "control", cooldownMs: 1100, ammo: 8, projectileSpeed: 260, blastRadius: 50, terrainDamage: 30, recoil: 32 },
  { id: "repulse-dome", name: "Repulse Dome", category: "utility", cooldownMs: 1600, ammo: 5, projectileSpeed: 240, blastRadius: 0, terrainDamage: 0, recoil: 18, utility: true },
  { id: "vortex-fan", name: "Vortex Fan", category: "utility", cooldownMs: 750, ammo: 14, projectileSpeed: 300, blastRadius: 0, terrainDamage: 4, recoil: 62, utility: true },
  { id: "blink-thruster", name: "Blink Thruster", category: "utility", cooldownMs: 900, ammo: 10, projectileSpeed: 0, blastRadius: 0, terrainDamage: 0, recoil: 120, utility: true },
  { id: "corrosion-flask", name: "Corrosion Flask", category: "control", cooldownMs: 1250, ammo: 8, projectileSpeed: 300, blastRadius: 38, terrainDamage: 8, recoil: 34 },
  { id: "seeker-dart", name: "Seeker Dart", category: "precision", cooldownMs: 1500, ammo: 8, projectileSpeed: 420, blastRadius: 30, terrainDamage: 12, recoil: 44 },
  { id: "ember-mortar", name: "Ember Mortar", category: "control", cooldownMs: 1350, ammo: 7, projectileSpeed: 280, blastRadius: 54, terrainDamage: 20, recoil: 72 },
  { id: "rail-spark", name: "Rail Spark", category: "precision", cooldownMs: 700, ammo: 16, projectileSpeed: 760, blastRadius: 10, terrainDamage: 6, recoil: 24 }
];
