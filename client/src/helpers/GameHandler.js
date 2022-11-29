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
      this.removeTintFromIcons();
      this.checkSubAbility();
      if (scene.isMyTurn) {
        this.decrementCooldown();
        this.checkAirCraftAbility();
        this.checkDestroyerAbility();
      }
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

    this.decrementCooldown = () => {
      Object.entries(scene.player.player.flotta).map((ship) => {
        if (ship[1].abilityCount > 0) {
          ship[1].abilityCount--;
          console.log(ship[1].abilityCount);
        }
      });
    };

    this.checkSubAbility = () => {
      if (scene.subAbilityActive) {
        scene.player.player.flotta.submarine.abilityCount =
          scene.player.player.flotta.submarine.abilityCooldown;
        scene.subAbilityActive = false;
      }
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
      /*scene.player.player.flotta.aircraft.abilityCount =
          scene.player.player.flotta.aircraft.abilityCooldown;
        scene.aircraftAbilityActive = false;*/
    };
  }
}
