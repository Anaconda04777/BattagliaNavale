import Ship from "./Ship";

export default class Battleship extends Ship {
  constructor(scene, x, y, ourShip) {
    super(scene, "Battleship", 4, x, y, ourShip, 30, "battleshipAbility", 4);
  }

  battleshipAbility() {
    this.abilityUsed = !this.abilityUsed;
    this.hp++;
    this.scene.socket.emit("battleshipAbility", this.id, this.hp);
    console.log("Battleship ability used: ", this);
    this.abilityCount = this.abilityCooldown;

    this.scene.GameHandler.changeTurn();
    this.scene.socket.emit("changeTurn");
  }
}
