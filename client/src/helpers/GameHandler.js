export default class GameHandler {
  constructor(scene) {
    this.changeTurn = (turn) => {
      //console.log(turn);
      //turn variabile passata solo al primo turno
      scene.isMyTurn = turn != undefined ? turn : !scene.isMyTurn;
      console.log(scene.isMyTurn);
      scene.isMyTurnText.setText(scene.isMyTurn ? "Your turn" : "Enemy turn");
      scene.alreadyFired = false;
      //resetto il focus dell'abilità
      scene.UIHandler.abilitySelected = null;
      this.removeTintFromIcons();
      this.checkSubAbility();
      if (scene.isMyTurn) {
        this.decrementCooldown();
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
        scene.subAbilityActive = false;
      }
    };

    this.checkDestroyerAbility = () => {
      console.log(scene.choosenShip);
      if (scene.choosenShip.length >= 2) {
        //alpha a 0.0000001 perché se no con 0 non mi fa cliccare sulle navi
        scene.choosenShip[0].bodyReference.alpha = 0.00000001;
        scene.choosenShip[1].bodyReference.alpha = 0.00000001;

        console.log(scene.choosenShip);
        scene.choosenShip.splice(0, 2);
        console.log(scene.choosenShip);
      }
    };
  }
}
