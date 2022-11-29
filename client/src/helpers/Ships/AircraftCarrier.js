import Ship from "./Ship";

export default class AircraftCarrier extends Ship {
  constructor(scene, x, y, ourShip) {
    super(scene, "AircraftCarrier", 1, x, y, ourShip, 20, "carrierAbility", 1);
  }

  carrierAbility() {
    console.log("AircraftCarrier ability used: ", this);
    this.scene.carrierAbilityActive = true;
  }
}
