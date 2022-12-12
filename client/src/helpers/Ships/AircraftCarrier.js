import Ship from "./Ship";

export default class AircraftCarrier extends Ship {
  constructor(scene, x, y, ourShip, name) {
    super(
      scene,
      "AircraftCarrier",
      2,
      x,
      y,
      ourShip,
      40,
      "carrierAbility",
      1,
      name
    ); //6
  }

  carrierAbility() {
    this.abilityUsed = !this.abilityUsed;
    console.log("AircraftCarrier ability used: ", this);
    this.scene.carrierAbilityActive = true;
  }

  update() {
    //sposto la shape statica in base alla posizione della sprite
    //se la nave è in verticale devo invertire i fattori di sottrazione
    //aggiunta di fattori dovuto a bug della posizione dopo il movimento con gli angoli
    if (this.dir) {
      this.bodyReference.body.y = this.bodyReference.y - 20;
      this.bodyReference.body.x = this.bodyReference.x - 90;
    } else {
      this.bodyReference.body.y = this.bodyReference.y - 90;
      this.bodyReference.body.x = this.bodyReference.x - 20;
    }
  }
}
