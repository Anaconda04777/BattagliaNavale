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
    };

    this.removeTintFromIcons = () => {
      Object.entries(scene.icon).map((icon) => {
        if (icon[1]) {
          console.log(icon);
          icon[1].clearTint();
          icon[1].setInteractive(true);
          icon[1].setVisible(false);
        }
      });
    };
  }
}
