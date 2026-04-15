import Phaser from "phaser";

export class TerrainField {
  readonly width: number;
  readonly height: number;
  readonly cell: number;
  private solid: Uint8Array;
  private gfx: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, width: number, height: number, cell = 4) {
    this.width = width;
    this.height = height;
    this.cell = cell;
    const cols = Math.ceil(width / cell);
    const rows = Math.ceil(height / cell);
    this.solid = new Uint8Array(cols * rows);
    this.gfx = scene.add.graphics().setDepth(1);
    this.generateIsland();
    this.redraw();
  }

  private index(col: number, row: number): number {
    return row * Math.ceil(this.width / this.cell) + col;
  }

  private generateIsland(): void {
    const cols = Math.ceil(this.width / this.cell);
    const rows = Math.ceil(this.height / this.cell);
    const cx = this.width * 0.5;
    const cy = this.height * 0.62;

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const x = c * this.cell;
        const y = r * this.cell;
        const nx = (x - cx) / (this.width * 0.38);
        const ny = (y - cy) / (this.height * 0.22);
        const radial = nx * nx + ny * ny;
        const ripple = 0.18 * Math.sin(x * 0.02) + 0.14 * Math.cos(y * 0.03);
        const isSolid = radial + ripple < 1.0 && y > this.height * 0.24;
        this.solid[this.index(c, r)] = isSolid ? 1 : 0;
      }
    }
  }

  isSolidAt(x: number, y: number): boolean {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return false;
    const col = Math.floor(x / this.cell);
    const row = Math.floor(y / this.cell);
    const cols = Math.ceil(this.width / this.cell);
    return this.solid[row * cols + col] === 1;
  }

  destroyCircle(cx: number, cy: number, radius: number): void {
    const cols = Math.ceil(this.width / this.cell);
    const minC = Math.max(0, Math.floor((cx - radius) / this.cell));
    const maxC = Math.min(cols - 1, Math.ceil((cx + radius) / this.cell));
    const rows = Math.ceil(this.height / this.cell);
    const minR = Math.max(0, Math.floor((cy - radius) / this.cell));
    const maxR = Math.min(rows - 1, Math.ceil((cy + radius) / this.cell));
    const rr = radius * radius;

    for (let r = minR; r <= maxR; r += 1) {
      for (let c = minC; c <= maxC; c += 1) {
        const x = c * this.cell + this.cell * 0.5;
        const y = r * this.cell + this.cell * 0.5;
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy <= rr) this.solid[this.index(c, r)] = 0;
      }
    }
    this.redraw();
  }

  normalAt(x: number, y: number): Phaser.Math.Vector2 {
    const sample = (sx: number, sy: number): number => (this.isSolidAt(sx, sy) ? 1 : 0);
    const gx = sample(x + this.cell, y) - sample(x - this.cell, y);
    const gy = sample(x, y + this.cell) - sample(x, y - this.cell);
    const n = new Phaser.Math.Vector2(-gx, -gy);
    if (n.lengthSq() < 0.001) return new Phaser.Math.Vector2(0, -1);
    return n.normalize();
  }

  snapToSurface(x: number, y: number, maxDist: number): { hit: boolean; x: number; y: number; nx: number; ny: number } {
    for (let d = 0; d <= maxDist; d += this.cell) {
      for (const sign of [-1, 1]) {
        const sy = y + d * sign;
        if (this.isSolidAt(x, sy)) {
          const n = this.normalAt(x, sy);
          return { hit: true, x, y: sy - n.y * 10, nx: n.x, ny: n.y };
        }
      }
    }
    return { hit: false, x, y, nx: 0, ny: -1 };
  }

  dissolveBelow(yLevel: number): void {
    const cols = Math.ceil(this.width / this.cell);
    const rows = Math.ceil(this.height / this.cell);
    const startRow = Math.max(0, Math.floor(yLevel / this.cell));
    for (let r = startRow; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        if (Math.random() < 0.03) this.solid[this.index(c, r)] = 0;
      }
    }
    this.redraw();
  }

  private redraw(): void {
    this.gfx.clear();
    this.gfx.fillStyle(0x24406b, 1);
    const cols = Math.ceil(this.width / this.cell);
    const rows = Math.ceil(this.height / this.cell);
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        if (this.solid[this.index(c, r)] === 1) {
          this.gfx.fillRect(c * this.cell, r * this.cell, this.cell + 1, this.cell + 1);
        }
      }
    }
  }
}
