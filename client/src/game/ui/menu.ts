import { perks, weapons } from "@skyforge/shared";

export function createMainMenu(root: HTMLElement, onSolo: () => void): void {
  const panel = document.createElement("div");
  panel.id = "menu";
  panel.innerHTML = `
    <div class="card panel">
      <h1>Skyforge Skirmish</h1>
      <p>Original 2D magnetic-tank battle royale prototype.</p>
      <button id="solo">Play Solo</button>
      <button id="host">Host Private Match</button>
      <button id="join">Join by Code</button>
      <button id="settings">Settings</button>
      <details><summary>Loadout</summary><p>Weapons: ${weapons.slice(0, 6).map((w) => w.name).join(", ")}...</p></details>
      <details><summary>Perks</summary><p>${perks.map((p) => p.name).join(", ")}</p></details>
      <p style="opacity:.75">A/D drive · Mouse aim · LMB fire · Wheel switch · Shift brake · Space utility</p>
    </div>
  `;
  root.appendChild(panel);

  const close = (): void => panel.remove();
  (panel.querySelector("#solo") as HTMLButtonElement).onclick = () => {
    close();
    onSolo();
  };
  (panel.querySelector("#host") as HTMLButtonElement).onclick = () => alert("Private P2P lobby scaffolded. Run signaling server and integrate WebRTC exchange.");
  (panel.querySelector("#join") as HTMLButtonElement).onclick = () => alert("Join-by-code is supported by signaling room flow in server package.");
  (panel.querySelector("#settings") as HTMLButtonElement).onclick = () => alert("Settings persist via localStorage in future polish.");
}
