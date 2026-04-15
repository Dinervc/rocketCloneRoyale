import type { PerkId } from "../types";

export interface PerkDef {
  id: PerkId;
  name: string;
  description: string;
}

export const perks: PerkDef[] = [
  { id: "reinforced-hull", name: "Reinforced Hull", description: "+25 max integrity" },
  { id: "traction-kit", name: "Traction Kit", description: "Higher tangent force on steep terrain" },
  { id: "scavenger-field", name: "Scavenger Field", description: "Pull nearby salvage drops" },
  { id: "tactical-scanner", name: "Tactical Scanner", description: "Briefly reveals enemy primary class" },
  { id: "overclock-reactor", name: "Overclock Reactor", description: "Lower cooldowns, higher self-recoil" },
  { id: "shock-mounts", name: "Shock Mounts", description: "Reduced explosion knockback" },
  { id: "reserve-bay", name: "Reserve Bay", description: "+1 reserve slot for chosen category" },
  { id: "heat-sinks", name: "Heat Sinks", description: "Reduced hazard stress and faster recovery" },
  { id: "aerial-stabilizers", name: "Aerial Stabilizers", description: "Improved mid-air steering" },
];
