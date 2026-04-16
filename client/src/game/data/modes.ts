export interface ModeDef {
  id: string;
  name: string;
  hazard: "plasma-tide" | "storm-ring" | "lava-surge" | "corrosive-fog";
  description: string;
}

export const modeDefs: ModeDef[] = [
  { id: "solo-survival", name: "Solo Survival", hazard: "plasma-tide", description: "Last pilot standing." },
  { id: "duos", name: "Duos", hazard: "plasma-tide", description: "Pairs battle for altitude." },
  { id: "squads", name: "Squads", hazard: "plasma-tide", description: "Team elimination." },
  { id: "team-skirmish", name: "Team Skirmish", hazard: "storm-ring", description: "Respawn-enabled score race." },
  { id: "zero-g-lab", name: "Zero-G Lab", hazard: "corrosive-fog", description: "Low gravity experiment." },
  { id: "hyperballistics", name: "Hyperballistics", hazard: "plasma-tide", description: "Fast projectiles mode." },
  { id: "sudden-spark", name: "Sudden Spark", hazard: "lava-surge", description: "One-hit sudden death." },
  { id: "mine-mayhem", name: "Mine Mayhem", hazard: "plasma-tide", description: "Mine-focused chaos." },
  { id: "private-custom", name: "Private Custom", hazard: "plasma-tide", description: "Custom private lobby." },
];
