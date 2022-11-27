import Ship from "./Ship";

export default class Submarine extends Ship {
  constructor(scene, x, y, ourShip) {
    super(scene, "Som", 1, x, y, ourShip, 20, "subAbility");
  }
}
