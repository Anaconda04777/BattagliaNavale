import Ship from "./Ship";

export default class Submarine extends Ship {
  constructor(scene, x, y, ourShip, name) {
    super(scene, "Som", 1, x, y, ourShip, 40, "subAbility", 1, name);
  }

  submarineAbility() {
    this.abilityUsed = !this.abilityUsed;
    this.scene.subAbilityActive = true;
    console.log("Submarine ability used: ", this);
  }

  update() {
    //sposto la shape statica in base alla posizione della sprite
    //se la nave è in verticale devo invertire i fattori di sottrazione
    //aggiunta di fattori dovuto a bug della posizione dopo il movimento con gli angoli
    if (this.dir) {
      this.bodyReference.body.y = this.bodyReference.y - 7;
      this.bodyReference.body.x = this.bodyReference.x - 45;
    } else {
      this.bodyReference.body.y = this.bodyReference.y - 45;
      this.bodyReference.body.x = this.bodyReference.x - 7;
    }
  }
}
