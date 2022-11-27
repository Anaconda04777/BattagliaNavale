import Ship from "./Ship";

export default class Battleship extends Ship {
  constructor(scene, x, y, ourShip) {
    super(scene, "Battleship", 3, x, y, ourShip, 10, "battleshipAbility");
  }

  battleshipAbility() {
    this.hp++;
    this.scene.socket.emit("battleshipAbility", this.id, this.hp);
    console.log("Battleship ability used: ", this);

    this.scene.GameHandler.changeTurn();
    this.scene.socket.emit("changeTurn");
  }
}
