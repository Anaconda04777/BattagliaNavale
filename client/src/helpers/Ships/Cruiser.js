import Ship from "./Ship";

export default class Cruiser extends Ship {
  constructor(scene, x, y, ourShip, name) {
    super(scene, "Cruiser", 3, x, y, ourShip, 55, "cruiserAbility", 3, name);
  }

  cruiserAbility() {
    this.abilityUsed = !this.abilityUsed;
    console.log("Cruiser ability used: ", this);
    this.scene.cruiserAbilityActive = 1;
  }

  update() {
    //sposto la shape statica in base alla posizione della sprite
    //se la nave è in verticale devo invertire i fattori di sottrazione
    //aggiunta di fattori dovuto a bug della posizione dopo il movimento con gli angoli
    if (this.dir) {
      this.bodyReference.body.y = this.bodyReference.y - 15;
      this.bodyReference.body.x = this.bodyReference.x - 70;
    } else {
      this.bodyReference.body.y = this.bodyReference.y - 70;
      this.bodyReference.body.x = this.bodyReference.x - 15;
    }
  }
}
