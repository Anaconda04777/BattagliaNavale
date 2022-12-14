import UIHandler from "../helpers/UIHandler.js";
import LogicHandler from "../helpers/LogicHandler.js";
import InputHandler from "../helpers/InputHandler.js";
import SocketHandler from "../helpers/SocketHandler.js";
import GameHandler from "../helpers/GameHandler.js";
import BulletHandler from "../helpers/BulletHandler.js";
import AirplaneHandler from "../helpers/AirplaneHandler.js";
import AnimationHandler from "../helpers/AnimationHandler.js";

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
    this.shipInformationElemements = [];
    //per abilità destroyer
    this.choosenShip = [];
    //per abilità cruiser
    this.cruiserAbilityActive = 0;
    //per abilità cv
    this.carrierAbilityActive = false;
    this.shipSpottedWithAircraft = [];
  }

  preload() {
    //l'import non è casesensitive
    this.load.image("Battleship", "src/assets/Battleship.svg");
    this.load.image("Cruiser", "src/assets/Cruiser.svg");
    this.load.image("Destroyer", "src/assets/Destroyer.svg");
    this.load.image("Som", "src/assets/Som.svg");
    this.load.image("AircraftCarrier", "src/assets/AircraftCarrier.svg");

    this.load.image("bullet", "src/assets/bullet.png");
    this.load.image("torpedo", "src/assets/torpedo.png");
    this.load.image("airplane", "src/assets/airplane.png");
    this.load.image("bomb", "src/assets/bomb.png");

    this.load.image("movementIcon", "src/assets/movementIcon.png");
    this.load.image("battleshipAbility", "src/assets/battleshipAbility.png");
    this.load.image("cruiserAbility", "src/assets/cruiserAbility.png");
    this.load.image("destroyerAbility", "src/assets/destroyerAbility.png");
    this.load.image("subAbility", "src/assets/subAbility.png");
    this.load.image("carrierAbility", "src/assets/carrierAbility.png");

    this.load.image("spotSignal", "src/assets/spotSignal.png");

    this.load.image("particles", "src/assets/particles.png");
  }

  create() {
    this.shipGroup = this.add.group();
    this.enemyShipGroup = this.add.group();

    this.icon = {
      movementIcon: null,
      abiltyIcon: null,
    };

    this.player = {
      player: {
        id: null,
        isReady: false,
        flotta: {
          battleship: new Battleship(this, 100, 150, true, "BattleShip"),
          aircraftCarrier: new AircraftCarrier(
            this,
            100,
            100,
            true,
            "Aircraft Carrier"
          ),
          cruiser: new Cruiser(this, 100, 200, true, "Cruiser 1"),
          cruiser2: new Cruiser(this, 100, 250, true, "Cruiser 2"),
          destroyer: new Destroyer(this, 100, 300, true, "Destroyer 1"),
          destroyer2: new Destroyer(this, 100, 350, true, "Destroyer 2"),
          submarine: new Submarine(this, 100, 400, true, "Submarine"),
        },
      },
      opponent: {
        id: null,
        isReady: false,
        flottaNemica: {
          battleship: new Battleship(
            this,
            this.scale.width - 100,
            150,
            false,
            "BattleShip"
          ),
          aircraftCarrier: new AircraftCarrier(
            this,
            this.scale.width - 100,
            100,
            false,
            "Aircraft Carrier"
          ),

          cruiser: new Cruiser(
            this,
            this.scale.width - 100,
            200,
            false,
            "Cruiser 1"
          ),
          cruiser2: new Cruiser(
            this,
            this.scale.width - 100,
            250,
            false,
            "Cruiser 2"
          ),
          destroyer: new Destroyer(
            this,
            this.scale.width - 100,
            300,
            false,
            "Destroyer 1"
          ),
          destroyer2: new Destroyer(
            this,
            this.scale.width - 100,
            350,
            false,
            "Destroyer 2"
          ),
          submarine: new Submarine(
            this,
            this.scale.width - 100,
            400,
            false,
            "Submarine"
          ),
        },
      },
    };

    //this.

    //this.

    Object.entries(this.player.opponent.flottaNemica).map((item) => {
      item[1].bodyReference.flipX = true;
    });

    this.AnimationHandler = new AnimationHandler(this);
    this.UIHandler = new UIHandler(this);
    this.UIHandler.buildUI();
    this.LogicHandler = new LogicHandler(this);
    this.InputHandler = new InputHandler(this);
    this.SocketHandler = new SocketHandler(this);
    this.GameHandler = new GameHandler(this);
    this.BulletHandler = new BulletHandler(this);
    this.AirplaneHandler = new AirplaneHandler(this);
  }

  update() {
    //this.InputHandler.setShipOverFalse();
    //console.log(this.enemyBullet);
    this.LogicHandler.checkVisibilitiOfBullet(this.enemyBullet);
    this.LogicHandler.checkVisibilitiOfBullet(this.enemyPlane);

    /*if (this.enemyBullet.length > 0) {
      this.enemyBullet.forEach((bullet) => {
        console.log(bullet);
        this.animationPlayer.particles.setPosition(bullet.x, bullet.y);
      });*/
  }
}
