export default class UIHandler {
  constructor(scene) {
    this.abilitySelected = null;
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
      scene.fillBox = scene.add
        .rectangle(256, scene.scale.height - 80, 512, 20, 0x000000, 0)
        .setInteractive();

      //console.log(scene.scale.width);
    };

    this.buildConsumablesIcon = () => {
      scene.icon.movementIcon = scene.add
        .image(
          scene.scale.width / 4 - 35,
          scene.scale.height - 36.5,
          "movementIcon"
        )
        .setInteractive()
        .setVisible(false);
      scene.icon.abilityIcon = scene.add
        .image(
          scene.scale.width / 4 + 35,
          scene.scale.height - 36.5,
          "battleshipAbility"
        )
        .setInteractive()
        .setVisible(false);

      scene.icon.movementIcon.on("pointerdown", () => {
        if (scene.isMyTurn && !scene.alreadyFired && !scene.subAbilityActive) {
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
          scene.InputHandler.focus.data.abilityCount == 0
        ) {
          let shipAbility = scene.icon.abilityIcon.texture.key;
          if (this.abilitySelected == shipAbility) {
            scene.icon.abilityIcon.clearTint();
            this.abilitySelected = null;
          } else {
            switch (shipAbility) {
              case "battleshipAbility":
                console.log(scene.InputHandler.focus);
                scene.InputHandler.focus.data.battleshipAbility();
                break;
              case "subAbility":
                scene.InputHandler.focus.data.submarineAbility();
                break;
              case "destroyerAbility":
                scene.InputHandler.focus.data.destroyerAbility();
                break;
            }
            scene.icon.abilityIcon.setTint(0x63b159);
            this.abilitySelected = shipAbility;
          }
        }
      });
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
      scene.fillBox = scene.add
        .rectangle(256, 55, 512, 20, 0x000000, 0)
        .setInteractive();
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

    this.buildUI = () => {
      this.buildConsumalesBox();
      this.buildConsumablesIcon();
      this.buildLine();
      this.isMyTurnText();
      this.imReady();
      this.enemyready();
      this.readyButton();
      this.buildHeader();

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
