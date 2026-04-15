import Phaser from "phaser";
import { physicsConfig, weapons } from "@skyforge/shared";
import { emptyInput } from "../core/input";
import type { MatchRuntime, ProjectileState, TankState } from "../core/state";
import { createTank } from "../entities/factories";
import { applyTankPhysics } from "../physics/sim";
import { decideBotInput } from "../ai/botAI";
import { stepHazard } from "../systems/hazardSystem";
import { updateMatch } from "../systems/matchSystem";
import { stepProjectiles } from "../systems/projectileSystem";
import { TerrainField } from "../terrain/TerrainField";
import { cycleWeapon, tryFire } from "../weapons/weaponSystem";
import { updateHUD } from "../ui/hud";

interface TankView {
  body: Phaser.GameObjects.Rectangle;
  turret: Phaser.GameObjects.Line;
  label: Phaser.GameObjects.Text;
}

export class MainScene extends Phaser.Scene {
  private terrain!: TerrainField;
  private tanks: TankState[] = [];
  private projectiles: ProjectileState[] = [];
  private runtime: MatchRuntime = { tick: 0, elapsedMs: 0, hazardY: 900, started: true, over: false };
  private playerId = "player-1";
  private fixedAccumulator = 0;
  private playerInput = emptyInput();
  private tankViews = new Map<string, TankView>();
  private projectileGfx!: Phaser.GameObjects.Graphics;
  private hazardGfx!: Phaser.GameObjects.Graphics;

  constructor() {
    super("main");
  }

  create(): void {
    this.terrain = new TerrainField(this, 1280, 720, 4);
    this.tanks = [
      createTank(this.playerId, "Pilot", 340, 230, false),
      createTank("bot-1", "Rook", 780, 210, true),
      createTank("bot-2", "Vela", 900, 270, true),
      createTank("bot-3", "Mako", 460, 180, true),
    ];

    this.projectileGfx = this.add.graphics().setDepth(10);
    this.hazardGfx = this.add.graphics().setDepth(5);
    this.playerInput = emptyInput();

    this.initInput();
    this.createViews();
  }

  private initInput(): void {
    this.input.keyboard?.on("keydown-A", () => { this.playerInput.move = -1; });
    this.input.keyboard?.on("keydown-D", () => { this.playerInput.move = 1; });
    this.input.keyboard?.on("keyup-A", () => { if (this.playerInput.move < 0) this.playerInput.move = 0; });
    this.input.keyboard?.on("keyup-D", () => { if (this.playerInput.move > 0) this.playerInput.move = 0; });
    this.input.keyboard?.on("keydown-SHIFT", () => { this.playerInput.brake = true; });
    this.input.keyboard?.on("keyup-SHIFT", () => { this.playerInput.brake = false; });
    this.input.keyboard?.on("keydown-SPACE", () => { this.playerInput.utility = true; });
    this.input.keyboard?.on("keyup-SPACE", () => { this.playerInput.utility = false; });
    this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      this.playerInput.aimX = p.worldX;
      this.playerInput.aimY = p.worldY;
    });
    this.input.on("pointerdown", () => { this.playerInput.fire = true; });
    this.input.on("pointerup", () => { this.playerInput.fire = false; });
    this.input.on("wheel", (_: unknown, __: number, ___: number, dY: number) => {
      this.playerInput.weaponIndexDelta = dY > 0 ? 1 : -1;
    });
  }

  private createViews(): void {
    this.tankViews.clear();
    for (const [i, tank] of this.tanks.entries()) {
      const color = [0x7fc4ff, 0xffa87f, 0x95ff95, 0xee9eff][i % 4] ?? 0xffffff;
      const body = this.add.rectangle(tank.x, tank.y, 28, 16, color).setDepth(11);
      const turret = this.add.line(tank.x, tank.y, 0, 0, 22, 0, 0xf7fbff).setDepth(12).setLineWidth(3);
      const label = this.add.text(tank.x, tank.y - 18, tank.name, { fontSize: "12px", color: "#d8e5ff" }).setDepth(12).setOrigin(0.5);
      this.tankViews.set(tank.id, { body, turret, label });
    }
  }

  update(_: number, delta: number): void {
    if (this.runtime.over) return;

    this.fixedAccumulator += delta;
    while (this.fixedAccumulator >= physicsConfig.fixedDeltaMs) {
      this.stepFixed(physicsConfig.fixedDeltaMs);
      this.fixedAccumulator -= physicsConfig.fixedDeltaMs;
    }

    this.renderWorld();
  }

  private stepFixed(dtMs: number): void {
    const player = this.tanks.find((t) => t.id === this.playerId);
    if (!player || !player.alive) return;

    const aim = {
      x: this.playerInput.aimX - player.x,
      y: this.playerInput.aimY - player.y,
    };

    cycleWeapon(player, this.playerInput.weaponIndexDelta);
    this.playerInput.weaponIndexDelta = 0;

    for (const tank of this.tanks) {
      if (!tank.alive) continue;
      const isPlayer = tank.id === this.playerId;
      const botDecision = !isPlayer ? decideBotInput(tank, this.tanks, this.runtime.hazardY) : undefined;
      const move = isPlayer ? this.playerInput.move : (botDecision?.move ?? 0);
      const brake = isPlayer ? this.playerInput.brake : false;
      const fire = isPlayer ? this.playerInput.fire : Boolean(botDecision?.fire);
      const utility = isPlayer ? this.playerInput.utility : Boolean(botDecision?.utility);
      const shotAim = isPlayer ? aim : { x: botDecision?.aimX ?? 1, y: botDecision?.aimY ?? 0 };

      applyTankPhysics(tank, move, brake, this.terrain, dtMs);
      if (fire || utility) this.projectiles.push(...tryFire(tank, shotAim.x, shotAim.y));
    }

    const outcome = stepProjectiles(this.projectiles, this.tanks, this.terrain, dtMs);
    if (outcome.edits.length && Math.random() < 0.06) this.sound.play?.("explosion");

    this.runtime.hazardY = stepHazard(this.tanks, this.runtime.elapsedMs, this.terrain);
    updateMatch(this.runtime, this.tanks);
  }

  private renderWorld(): void {
    this.projectileGfx.clear();
    this.projectileGfx.fillStyle(0xffe4a6, 1);
    for (const p of this.projectiles) this.projectileGfx.fillCircle(p.x, p.y, 3);

    this.hazardGfx.clear();
    this.hazardGfx.fillStyle(0xff4d91, 0.25);
    this.hazardGfx.fillRect(0, this.runtime.hazardY, this.scale.width, this.scale.height - this.runtime.hazardY);

    for (const tank of this.tanks) {
      const view = this.tankViews.get(tank.id);
      if (!view) continue;
      view.body.setVisible(tank.alive).setPosition(tank.x, tank.y).setRotation(tank.angle);
      view.turret.setVisible(tank.alive).setPosition(tank.x, tank.y).setRotation(tank.turretAngle);
      view.label.setVisible(tank.alive).setPosition(tank.x, tank.y - 18);
    }

    const me = this.tanks.find((t) => t.id === this.playerId);
    if (!me) return;
    const weapon = weapons.find((w) => w.id === me.selectedWeaponId);
    if (!weapon) return;
    updateHUD({
      hp: me.hp,
      maxHp: me.maxHp,
      weapon: weapon.name,
      ammo: me.weaponAmmo[me.selectedWeaponId],
      aliveCount: this.tanks.filter((t) => t.alive).length,
      timer: this.runtime.elapsedMs,
      hazardY: this.runtime.hazardY,
      phase: this.runtime.elapsedMs < 45_000 ? "prep" : this.runtime.elapsedMs < 90_000 ? "surge" : "finale",
      eliminated: !me.alive,
    });
  }
}
