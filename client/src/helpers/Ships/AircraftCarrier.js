import Ship from "./Ship";

export default class AircraftCarrier extends Ship {
  constructor(scene, x, y, ourShip) {
    super(scene, "AircraftCarrier", 2, x, y, ourShip, 40, "carrierAbility", 1); //6
  }

  carrierAbility() {
    this.abilityUsed = !this.abilityUsed;
    console.log("AircraftCarrier ability used: ", this);
    this.scene.carrierAbilityActive = true;
  }
}
