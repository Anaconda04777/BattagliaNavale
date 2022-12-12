import Ship from "./Ship";

export default class Battleship extends Ship {
  constructor(scene, x, y, ourShip, name) {
    super(
      scene,
      "Battleship",
      4,
      x,
      y,
      ourShip,
      30,
      "battleshipAbility",
      4,
      name
    );
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

  update() {
    //sposto la shape statica in base alla posizione della sprite
    //se la nave è in verticale devo invertire i fattori di sottrazione
    //aggiunta di fattori dovuto a bug della posizione dopo il movimento con gli angoli
    if (this.dir) {
      this.bodyReference.body.y = this.bodyReference.y - 20;
      this.bodyReference.body.x = this.bodyReference.x - 85;
    } else {
      this.bodyReference.body.y = this.bodyReference.y - 85;
      this.bodyReference.body.x = this.bodyReference.x - 20;
    }
  }
}
