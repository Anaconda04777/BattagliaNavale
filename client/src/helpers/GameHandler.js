export default class GameHandler {
  constructor(scene) {
    this.animationPlayer = scene.AnimationHandler;
    this.changeTurn = (turn) => {
      //console.log(turn);
      //turn variabile passata solo al primo turno
      scene.isMyTurn = turn != undefined ? turn : !scene.isMyTurn;
      //console.log(scene.isMyTurn);
      scene.isMyTurnText.setText(scene.isMyTurn ? "Your turn" : "Enemy turn");
      scene.alreadyFired = false;
      //resetto il focus dell'abilità
      scene.UIHandler.abilitySelected = null;
      scene.cantFocusAbiliyActive = false;
      scene.carrierAbilityActive = false;
      scene.subAbilityActive = false;

      if (!scene.isMyTurn) this.checkAbilityUsed();
      this.removeTintFromIcons();
      if (scene.isMyTurn) {
        this.decrementCooldown();
        this.checkAirCraftAbility();
        this.checkDestroyerAbility();
        this.showInformation();
      } else this.hideInformation();
    };

    this.removeTintFromIcons = () => {
      Object.entries(scene.icon).map((icon) => {
        if (icon[1]) {
          //console.log(icon);
          icon[1].clearTint();
          icon[1].setInteractive(true);
          icon[1].setVisible(false);
        }
      });
    };

    this.hideInformation = () => {
      if (scene.shipInformationElemements === undefined) return;
      scene.shipInformationElemements.map((element) => {
        element.setVisible(false);
      });
    };

    this.showInformation = () => {
      if (scene.shipInformationElemements === undefined) return;
      scene.shipInformationElemements.map((element) => {
        element.setVisible(true);
      });
    };

    this.decrementCooldown = () => {
      Object.entries(scene.player.player.flotta).map((ship) => {
        if (ship[1].abilityCount > 0) {
          ship[1].abilityCount--;
          console.log(ship[1].abilityCount);
        }
      });
    };

    this.checkDestroyerAbility = () => {
      //console.log(scene.choosenShip);
      if (scene.choosenShip.length >= 2) {
        //alpha a 0.0000001 perché se no con 0 non mi fa cliccare sulle navi
        this.animationPlayer.hideShip(scene.choosenShip[0].bodyReference);
        this.animationPlayer.hideShip(scene.choosenShip[1].bodyReference);

        scene.choosenShip.splice(0, 2);
        console.log(scene.choosenShip);
      }
    };

    this.checkAirCraftAbility = () => {
      if (scene.shipSpottedWithAircraft.length > 0) {
        scene.shipSpottedWithAircraft.map((ship) => {
          this.animationPlayer.hideShip(ship);
        });
        scene.shipSpottedWithAircraft = [];
      }
    };

    this.checkAbilityUsed = () => {
      Object.entries(scene.player.player.flotta).map((ship) => {
        //console.log(ship[1]);
        if (ship[1].abilityUsed) {
          ship[1].abilityCount = ship[1].abilityCooldown;
          ship[1].abilityUsed = false;
        }
      });
    };
  }
}
