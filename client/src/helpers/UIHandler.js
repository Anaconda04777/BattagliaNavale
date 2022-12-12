import Phaser, { Scene } from "phaser";

export default class UIHandler {
  constructor(scene) {
    this.abilitySelected = null;
    this.informationBuilt = false;
    //rettangolo per i consumabili
    this.buildConsumalesBox = () => {
      scene.consumablesBox = scene.add
        .rectangle(
          scene.scale.width / 2,
          730,
          scene.scale.width,
          73,
          0x000000,
          0.6
        )
        .setInteractive();
      /*scene.fillBox = scene.add
        .rectangle(256, scene.scale.height - 80, 512, 20, 0x000000, 0)
        .setInteractive();*/

      //console.log(scene.scale.width);
    };

    this.buildConsumablesIcon = () => {
      scene.icon.movementIcon = scene.add
        .image(
          scene.scale.width / 4 - 30,
          scene.scale.height - 36.5,
          "movementIcon"
        )
        .setInteractive()
        .setVisible(false);
      scene.icon.abilityIcon = scene.add
        .image(
          scene.scale.width / 4 + 30,
          scene.scale.height - 36.5,
          "battleshipAbility"
        )
        .setInteractive()
        .setVisible(false);

      scene.icon.movementIcon.on("pointerdown", () => {
        if (
          scene.isMyTurn &&
          !scene.alreadyFired &&
          !scene.subAbilityActive &&
          scene.cruiserAbilityActive === 0 &&
          !scene.cantFocusAbiliyActive &&
          !scene.carrierAbilityActive
        ) {
          if (this.abilitySelected == "movement") {
            scene.icon.movementIcon.clearTint();
            this.abilitySelected = null;
          } else {
            scene.icon.movementIcon.setTint(0x63b159);
            this.abilitySelected = "movement";
          }
        }
      });

      scene.icon.abilityIcon.on("pointerdown", () => {
        if (
          scene.isMyTurn &&
          !scene.alreadyFired &&
          !scene.InputHandler.shipInMovement &&
          scene.InputHandler.focus.data.abilityCount == 0 &&
          !scene.cantFocusAbiliyActive &&
          this.abilitySelected != "movement"
        ) {
          console.log("abilità");
          let shipAbility = scene.icon.abilityIcon.texture.key;
          if (this.abilitySelected == shipAbility) {
            scene.icon.abilityIcon.clearTint();
            this.abilitySelected = null;

            //se sto ricliccando vuol dire che di sicuro, anche se sto cliccando un'altra abilità,
            //quella del sottomarino non sarà attiva
            //NB: idem per tutte le altre abilità
            scene.subAbilityActive = false;
            scene.cruiserAbilityActive = 0;
            scene.carrierAbilityActive = false;
          } else {
            switch (shipAbility) {
              case "battleshipAbility":
                scene.InputHandler.focus.data.battleshipAbility();
                break;
              case "subAbility":
                scene.InputHandler.focus.data.submarineAbility();
                break;
              case "destroyerAbility":
                scene.InputHandler.focus.data.destroyerAbility();
                break;
              case "cruiserAbility":
                scene.InputHandler.focus.data.cruiserAbility();
                break;
              case "carrierAbility":
                scene.InputHandler.focus.data.carrierAbility();
                break;
            }
            scene.icon.abilityIcon.setTint(0x63b159);
            this.abilitySelected = shipAbility;
          }
        }
      });
    };

    this.buildNavyInformation = () => {
      this.informationBuilt = true;

      scene.navyInformationTxt = scene.add
        .text(
          scene.scale.width / 2 - 100,
          scene.scale.height - 70,
          "Aircraft Carrier"
        )
        .setFontSize(13)
        .setFontFamily("Arial");
      console.log(scene.navyInformationTxt);

      scene.navyInformationImage = scene.add.image(
        scene.scale.width / 2 - 85,
        scene.scale.height - 40,
        "Battleship"
      );

      scene.statsText = scene.add
        .text(0, 0, "Statistiche")
        .setFontSize(13)
        .setFontFamily("Arial");

      scene.hpText = scene.add
        .text(0, 15, "Hp: 0")
        .setFontSize(13)
        .setFontFamily("Arial");

      scene.spottedText = scene.add
        .text(0, 30, "Spotted: ✔")
        .setFontSize(13)
        .setFontFamily("Arial");

      scene.cooldownAbilityText = scene.add
        .text(0, 45, "Ability Cooldown: 0")
        .setFontSize(13)
        .setFontFamily("Arial");

      scene.shipStats = new Phaser.GameObjects.Container(
        scene,
        20,
        scene.scale.height - 70,
        [
          scene.statsText,
          scene.hpText,
          scene.spottedText,
          scene.cooldownAbilityText,
        ]
      );
      scene.add.existing(scene.shipStats);
      console.log(scene.shipStats);

      scene.shipStats.add(scene.hpText);

      scene.shipInformationElemements = [
        scene.navyInformationTxt,
        scene.navyInformationImage,
        scene.shipStats,
      ];
    };

    this.updateNavyInformation = (ship) => {
      scene.hpText.setText("Hp: " + ship.data.hp);
      console.log(ship);
      scene.spottedText.setText(`Spotted: ${ship.data.spotted ? "✔" : "✘"}`);
      scene.cooldownAbilityText.setText(
        `Ability Cooldown: ${
          ship.data.abilityCount == 0 ? "ready" : ship.data.abilityCount
        }`
      );

      scene.navyInformationTxt.setText(ship.data.shipName);
      scene.navyInformationImage.setTexture(ship.texture.key);
    };

    this.showConsumables = (abilitySelected, focus) => {
      if (scene.gameStarted) {
        let icon = scene.icon.abilityIcon;
        //console.log(icon);
        icon.setTexture(abilitySelected).setVisible(true);
        scene.icon.movementIcon.setVisible(true);
        if (focus.data.abilityCount > 0) scene.icon.abilityIcon.alpha = 0.5;
        else scene.icon.abilityIcon.alpha = 1;
      }
    };

    this.buildHeader = () => {
      scene.header = scene.add
        .rectangle(0, 0, scene.scale.width * 2, 100, 0x000000, 0.6)
        .setInteractive();
      /*scene.fillBox = scene.add
        .rectangle(256, 55, 512, 20, 0x000000, 0)
        .setInteractive();*/
      scene.header.depth = -1;
    };

    //linea di divisione campi
    this.buildLine = () => {
      scene.line = scene.add.line(
        0,
        scene.scale.height / 2,
        scene.scale.width / 2,
        scene.scale.height,
        scene.scale.width / 2,
        0,
        0x000000
      );
      //console.log(scene.line);
    };

    this.enemyField = () => {
      scene.enemyField = scene.add.rectangle(
        scene.scale.width / 2 + 256,
        scene.scale.height / 2,
        scene.scale.width / 2,
        scene.scale.height,
        0x686666
      );
    };

    //TODO: animazione del testo che si dissolve
    this.isMyTurnText = () => {
      scene.isMyTurnText = scene.add
        .text(15, 10, "Your turn")
        .setFontSize(20)
        .setFontFamily("Arial")
        .setColor("#ffffff")
        .setStroke("#000000", 2);
      scene.isMyTurnText.visible = false;
    };

    this.endGameWindow = (text) => {
      scene.endGameWindow = scene.add.rectangle(
        scene.scale.width / 2,
        scene.scale.height / 2,
        scene.scale.width,
        scene.scale.height,
        0x000000,
        0.6
      );

      scene.endGameText = scene.add
        .text(scene.scale.width / 2 - 108.5, scene.scale.height / 2 - 57, text) //"You win!"
        .setFontSize(50)
        .setFontFamily("Arial")
        .setColor("#ffffff")
        .setStroke("#000000", 2);

      console.log(scene.endGameText);

      scene.restartButton = scene.add
        .text(scene.scale.width / 2 - 54.25, scene.scale.height / 2, "Restart")
        .setFontSize(30)
        .setFontFamily("Arial")
        .setColor("#ffffff")
        .setStroke("#000000", 2)
        .setInteractive();

      scene.restartButton.on("pointerdown", function () {
        scene.socket.emit("readyToRestart", scene.player.player.id);
        scene.restartButton.setText("Waiting");
        scene.restartButton.disableInteractive();
      });
      scene.restartButton.on("pointerover", function () {
        scene.restartButton.setColor("#ff0000");
      });
      scene.restartButton.on("pointerout", function () {
        scene.restartButton.setColor("#ffffff");
      });
    };

    this.imReady = () => {
      scene.imReady = scene.add.circle(
        scene.scale.width / 2 - 15,
        15,
        10,
        0xff0000
      );
    };

    this.enemyready = () => {
      scene.enemyReady = scene.add.circle(
        scene.scale.width / 2 + 15,
        15,
        10,
        0xff0000
      );
      scene.enemyReady.depth = 1;
    };

    this.readyButton = () => {
      scene.readyButton = scene.add
        .text(30, scene.scale.height - 50, "IM READY!")
        .setFontSize(15)
        .setFontFamily("Arial")
        .setColor("#ffffff")
        .setStroke("#000000", 2)
        .setInteractive();
    };

    this.tastoDellaMorte = () => {
      scene.tastoDellaMorte = scene.add
        .text(scene.scale.width - 30, 30, "X")
        .setFontSize(15)
        .setFontFamily("Arial")
        .setColor("#ffffff")
        .setStroke("#000000", 2)
        .setInteractive();

      scene.tastoDellaMorte.on("pointerdown", function () {
        Object.values(scene.player.opponent.flottaNemica).map((items) => {
          items.shipHit(1000);
        });
      });
    };

    this.buildUI = () => {
      this.buildConsumalesBox();
      this.buildConsumablesIcon();
      this.buildLine();
      this.isMyTurnText();
      this.imReady();
      this.enemyready();
      this.readyButton();
      this.buildHeader();

      this.tastoDellaMorte();
      scene.readyButton.on("pointerover", function () {
        scene.readyButton.setColor("#ff0000");
      });
      scene.readyButton.on("pointerout", function () {
        scene.readyButton.setColor("#ffffff");
      });

      //this.enemyField();
    };
  }
}
