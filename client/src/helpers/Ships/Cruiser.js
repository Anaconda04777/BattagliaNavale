import Ship from "./Ship";

export default class Cruiser extends Ship {
  constructor(scene, x, y, ourShip) {
    super(scene, "Cruiser", 2, x, y, ourShip, 40, "cruiserAbility", 3);
  }
}
