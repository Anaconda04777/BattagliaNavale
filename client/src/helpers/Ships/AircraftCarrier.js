import Ship from "./Ship";

export default class AircraftCarrier extends Ship {
  constructor(scene, x, y, ourShip) {
    super(scene, "AircraftCarrier", 1, x, y, ourShip, 20, "carrierAbility");
  }
}
