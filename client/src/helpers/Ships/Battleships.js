import Ship from "./Ship";

export default class Battleship extends Ship {
  constructor(scene, x, y, ourShip) {
    super(scene, "Battleship", 3, x, y, ourShip, 10, "battleshipAbility", 4);
  }

  battleshipAbility() {
    this.hp++;
    this.scene.socket.emit("battleshipAbility", this.id, this.hp);
    console.log("Battleship ability used: ", this);
    this.abilityCount = this.abilityCooldown;

    this.scene.GameHandler.changeTurn();
    this.scene.socket.emit("changeTurn");
  }
}
