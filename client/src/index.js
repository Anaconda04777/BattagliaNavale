import Phaser from "phaser";
import Game from "./scenes/Game.js";

let config = {
  type: Phaser.AUTO,
  backgroundColor: Phaser.Display.Color.HexStringToColor("#293e44"),
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 0 },
    },
  },
  scene: [Game],
};

const game = new Phaser.Game(config);
