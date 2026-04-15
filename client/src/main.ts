import Phaser from "phaser";
import { MainScene } from "./game/scenes/MainScene";
import { createHUD } from "./game/ui/hud";
import { createMainMenu } from "./game/ui/menu";

const hudRoot = document.getElementById("hud");
if (!hudRoot) throw new Error("Missing #hud root");

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "app",
  width: 1280,
  height: 720,
  backgroundColor: "#091427",
  physics: { default: "arcade" },
  scene: [MainScene],
});

createHUD(hudRoot);
createMainMenu(hudRoot, () => {
  game.scene.start("main");
});
