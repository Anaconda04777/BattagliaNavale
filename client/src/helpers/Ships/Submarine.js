import Ship from "./Ship";

export default class Submarine extends Ship {
  constructor(scene, x, y, ourShip, name) {
    super(scene, "Som", 1, x, y, ourShip, 40, "subAbility", 5, name);
  }

  submarineAbility() {
    this.abilityUsed = !this.abilityUsed;
    this.scene.subAbilityActive = true;
    console.log("Submarine ability used: ", this);
  }
}
