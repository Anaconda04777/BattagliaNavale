import UIHandler from "../helpers/UIHandler.js";
import LogicHandler from "../helpers/LogicHandler.js";
import InputHandler from "../helpers/InputHandler.js";
import SocketHandler from "../helpers/SocketHandler.js";
import GameHandler from "../helpers/GameHandler.js";
import BulletHandler from "../helpers/BulletHandler.js";

import Submarine from "../helpers/Ships/Submarine.js";
import Battleship from "../helpers/Ships/Battleships.js";
import AircraftCarrier from "../helpers/Ships/AircraftCarrier.js";
import Destroyer from "../helpers/Ships/Destroyer.js";
import Cruiser from "../helpers/Ships/Cruiser.js";

export default class Game extends Phaser.Scene {
  constructor() {
    super("Game");
    this.numPlayers = 0;
    this.isMyTurn;
    this.gameStarted = false;
  }

  preload() {
    this.load.image("Battleship", "src/assets/Battleship.png");
    this.load.image("Cruiser", "src/assets/Cruiser.png");
    this.load.image("Destroyer", "src/assets/Destroyer.png");
    this.load.image("Som", "src/assets/Som.png");
    this.load.image("AircraftCarrier", "src/assets/AircraftCarrier.png");

    this.load.image("bullet", "src/assets/bullet.png");

    this.load.image("movementIcon", "src/assets/movementIcon.png");
    this.load.image("battleshipAbility", "src/assets/battleshipAbility.png");
    this.load.image("cruiserAbility", "src/assets/cruiserAbility.png");
    this.load.image("destroyerAbility", "src/assets/destroyerAbility.png");
    this.load.image("subAbility", "src/assets/subAbility.png");
    this.load.image("carrierAbility", "src/assets/carrierAbility.png");
  }

  create() {
    this.shipGroup = this.add.group();
    this.icon = {
      movementIcon: null,
      abiltyIcon: null,
    };

    this.player = {
      player: {
        id: null,
        isReady: false,
        flotta: {
          aircraftCarrier: new AircraftCarrier(this, 100, 100, true),
          battleship: new Battleship(this, 100, 150, true),
          cruiser: new Cruiser(this, 100, 200, true),
          cruiser2: new Cruiser(this, 100, 250, true),
          destroyer: new Destroyer(this, 100, 300, true),
          destroyer2: new Destroyer(this, 100, 350, true),
          submarine: new Submarine(this, 100, 400, true),
        },
      },
      opponent: {
        id: null,
        isReady: false,
        flottaNemica: {
          aircraftCarrier: new AircraftCarrier(
            this,
            this.scale.width - 100,
            100
          ),
          battleship: new Battleship(this, this.scale.width - 100, 150, false),
          cruiser: new Cruiser(this, this.scale.width - 100, 200, false),
          cruiser2: new Cruiser(this, this.scale.width - 100, 250, false),
          destroyer: new Destroyer(this, this.scale.width - 100, 300, false),
          destroyer2: new Destroyer(this, this.scale.width - 100, 350, false),
          submarine: new Submarine(this, this.scale.width - 100, 400, false),
        },
      },
    };

    //this.

    //this.

    Object.entries(this.player.opponent.flottaNemica).map((item) => {
      item[1].bodyReference.flipX = true;
    });

    this.UIHandler = new UIHandler(this);
    this.UIHandler.buildUI();
    this.LogicHandler = new LogicHandler(this);
    this.InputHandler = new InputHandler(this);
    this.SocketHandler = new SocketHandler(this);
    this.GameHandler = new GameHandler(this);
    this.BulletHandler = new BulletHandler(this);
  }

  update() {
    //this.InputHandler.setShipOverFalse();
  }
}
