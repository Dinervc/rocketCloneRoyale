export interface HUDModel {
  hp: number;
  maxHp: number;
  weapon: string;
  ammo: number;
  aliveCount: number;
  timer: number;
  hazardY: number;
  phase: string;
  eliminated: boolean;
}

let updateFn: ((model: HUDModel) => void) | undefined;

export function createHUD(root: HTMLElement): void {
  root.innerHTML = `
    <div id="topbar">
      <div id="status" class="panel">HP</div>
      <div id="phase" class="panel">Phase</div>
    </div>
    <div id="bottom">
      <div id="weapon" class="panel">Weapon</div>
      <div id="alive" class="panel">Alive</div>
    </div>
  `;

  const status = root.querySelector("#status") as HTMLDivElement;
  const phase = root.querySelector("#phase") as HTMLDivElement;
  const weapon = root.querySelector("#weapon") as HTMLDivElement;
  const alive = root.querySelector("#alive") as HTMLDivElement;

  updateFn = (model) => {
    status.textContent = `HP ${Math.ceil(model.hp)}/${model.maxHp} | Hazard Alt ${Math.ceil(model.hazardY)}`;
    phase.textContent = `${model.phase} | ${Math.floor(model.timer / 1000)}s`;
    weapon.textContent = `${model.weapon} (${model.ammo})`;
    alive.textContent = `Alive ${model.aliveCount}${model.eliminated ? " | Spectating" : ""}`;
  };
}

export function updateHUD(model: HUDModel): void {
  updateFn?.(model);
}
