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
}
