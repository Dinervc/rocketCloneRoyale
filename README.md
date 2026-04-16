# Skyforge Skirmish (Original 2D Artillery Battle Royale MVP)

A fully original browser-playable prototype inspired by broad 2D artillery battle royale genre pillars.

## 1) Product / design brief

**Game concept:** Skyforge Skirmish is a side-view sci-fi tank survival game on floating terrain where tanks use magnetic adhesion to drive on slopes, walls, and ceilings. Players and bots fight with recoil-driven weapons while a rising **Plasma Tide** hazard forces vertical movement.

**Core value pillars**
- Readable skill expression: aiming, recoil movement, terrain shaping.
- Mobility mastery: magnetic adhesion + detachment + reattachment windows.
- Endgame pressure: vertical scramble from rising hazard phases.
- Lightweight multiplayer: private P2P rooms with host-authoritative simulation.

## 2) Core gameplay design
- Spawn on irregular floating island terrain.
- Drive tangent to local surface while adhesion is active.
- Aim independently and fire; recoil moves tank.
- Destroy terrain with blast stamps and digging-style shots.
- Hazard rises from below, dealing damage and reducing adhesion reliability.
- Last surviving tank wins.

## 3) Technical architecture

### Runtime model
- **Client:** Phaser 3 + TypeScript, fixed 60Hz simulation loop.
- **Terrain:** destructible voxel mask (`TerrainField`) with incremental redraw.
- **Physics:** custom lightweight rigid update with adhesion + air state.
- **Weapons/perks:** data-driven shared tables.
- **Bots:** utility-style scoring/decisions (`chooseTarget`, `chooseWeapon`, etc.).
- **Networking:** WebRTC-ready schema + `ws` signaling server for room, SDP, ICE exchange.

### Multiplayer authority
- Host peer simulates match state.
- Clients send inputs and render snapshots/events.
- Terrain edits are event-based (stamp params).
- If host leaves: match ends gracefully (documented MVP behavior).

## 4) Exact file tree

```text
.
├── client
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src
│       ├── main.ts
│       └── game
│           ├── ai/botAI.ts
│           ├── core/{input.ts,state.ts}
│           ├── data/{assets.ts,modes.ts}
│           ├── entities/factories.ts
│           ├── net/{p2p.ts,signalingClient.ts}
│           ├── physics/sim.ts
│           ├── scenes/MainScene.ts
│           ├── systems/{hazardSystem.ts,matchSystem.ts,projectileSystem.ts}
│           ├── terrain/TerrainField.ts
│           ├── ui/{hud.ts,menu.ts}
│           └── weapons/weaponSystem.ts
├── server
│   ├── package.json
│   ├── tsconfig.json
│   └── src/{protocol.ts,rooms.ts,signaling.ts}
├── shared
│   ├── package.json
│   ├── tsconfig.json
│   └── src
│       ├── config/{gameConfig.ts,perks.ts,weapons.ts}
│       ├── index.ts
│       ├── protocol.ts
│       └── types.ts
├── package.json
├── tsconfig.base.json
└── .gitignore
```

## 5) Implementation phases
- ✅ Phase 1: setup + single-tank fire/recoil baseline.
- ✅ Phase 2: destructible terrain + adhesion movement.
- ✅ Phase 3: hazard, elimination, match loop.
- ✅ Phase 4: 12 weapon defs + 9 perk defs + HUD/menu scaffolding.
- ✅ Phase 5: utility-based bot AI.
- ✅ Phase 6: signaling + P2P scaffolding.
- ⏳ Phase 7: polish and production hardening.

## 6–13) MVP systems delivered
- Shared protocol schemas: join/ready/input/fire/switch/snapshot/damage/terrain/loot/elim/match/gameOver/ping.
- Signaling server: room creation, join by code, host tracking, SDP/ICE relay.
- Client bootstrap + Phaser scene + fixed timestep.
- Physics: gravity, traction, adhesion snap, detachment impulse, reattach forgiveness.
- Terrain: destructible mask, circular stamps, hazard dissolve below flood line.
- Entities/systems: tanks, projectiles, hazard, match state.
- Weapons: 12 original weapon entries.
- Perks: 9 original perk entries.
- Bots: easy-to-medium utility behaviors and shot estimation.
- HUD/menu: main menu, loadout/perks display, in-match HUD.
- Audio hooks + asset manifest placeholders.
- Balance knobs in shared typed config tables.

## 14) Balancing table location
- `shared/src/config/gameConfig.ts`
- `shared/src/config/weapons.ts`
- `shared/src/config/perks.ts`

## 15) Testing checklist
- [ ] projectile trajectory consistency at 60Hz
- [ ] terrain destruction creates traversable gaps
- [ ] adhesion works across slopes/walls/ceilings
- [ ] detachment occurs on high impulse
- [ ] hazard rise always closes the match
- [ ] bots escape hazard and keep firing
- [ ] join/leave signaling does not crash rooms
- [ ] private room code flow works
- [ ] solo mode runs offline

## 16) Local run / build / deploy

### Install
```bash
npm install
```

### Run locally
```bash
npm run dev          # client on :5173
npm run dev:server   # signaling server on :8787
```

### Build all
```bash
npm run build
```

### Deploy
- **Client:** deploy `client` build output to Netlify/Vercel.
- **Signaling server:** deploy `server` to Fly.io/Render/Railway.
- **Env vars:** `PORT` for server.
- **WebRTC caveat:** production private matches generally require TURN for restrictive NATs.

## 17) Roadmap to alpha-complete
1. Host-authoritative full snapshot replication + client reconciliation.
2. Robust terrain polygonization/marching squares + chunk dirty rebuilds.
3. Dedicated audio mixer + generated placeholder pack.
4. Real perk effects wired into runtime systems.
5. Inventory/loadout persistence in localStorage.
6. Better bot tactical behaviors and navigation under terrain edits.
7. Matchmaking UX + spectate + post-match summary polish.

## Known limitations
- MVP terrain collision uses mask sampling, not full polygon mesh.
- WebRTC host-authoritative state sync is scaffolded, not full lockstep netcode.
- Placeholder audio hooks and procedural visuals only.
- No host migration in MVP.

## Next recommended improvements
- Implement event sequencing for authoritative terrain diffs.
- Add rollback/correction for client prediction.
- Add replayable balance test scenarios.

## Anti-cheat notes for host-authoritative P2P
- Host can still cheat by definition; mitigate with signed telemetry and peer cross-check in private communities.
- Validate client inputs (rate limits, impossible vectors, weapon cooldown enforcement).
- Sequence all combat events and reject out-of-order duplicates.

## Dedicated server migration path
- Replace host-peer sim with authoritative server process running same fixed-step systems.
- Keep shared protocol types and simulation code in shared package.
- Convert P2P signaling to match/session allocation API + websocket snapshots.
- Move trust boundaries: clients become input-only, server owns canonical terrain and damage.
