import Airplane from "./Airplane";

export default class AirplaneHandler extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
    this.reoloadAirplane();
    this.planeVelocity = 300;
    this.scene = scene;
  }

  spawnAirplane(target, angle, x, y) {
    //se il gruppo di volo è vuoto ricarico il gruppo
    if (this.children.size === 0) this.reoloadAirplane();

    //prende il primo elemento del gruppo con active false
    const plane = this.getFirstDead(false);

    if (plane) {
      plane.onFlight(target, angle, x, y);
    }

    //console.log(this);
  }

  reoloadAirplane() {
    this.createMultiple({
      frameQuantity: 3,
      key: "airplane",
      active: false,
      visible: false,
      //creo più istanze di bullet
      classType: Airplane,
    });
  }
}
