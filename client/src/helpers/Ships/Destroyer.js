import Ship from "./Ship";

export default class Destroyer extends Ship {
  constructor(scene, x, y, ourShip) {
    super(scene, "Destroyer", 1, x, y, ourShip, 50, "destroyerAbility");
  }
}
