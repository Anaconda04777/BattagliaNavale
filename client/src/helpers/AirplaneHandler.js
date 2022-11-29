import Airplane from "./Airplane";

export default class AirplaneHandler extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
    this.reoloadAirplane();
    this.planeVelocity = 300;
    this.scene = scene;
  }

  spawnAirplane(target, angle, x, y, itsSpottingAircraft) {
    const plane = this.getFirstDead(false);

    if (plane) {
      plane.onFlight(target, angle, x, y, itsSpottingAircraft);
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
