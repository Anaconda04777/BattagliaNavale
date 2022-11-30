export default class AnimationHandler {
  constructor(scene) {
    this.scene = scene;
  }

  showShip(ship, time = 1000) {
    //animazione di scopertura delle navi
    //console.log(ship);
    if (ship.data.hp <= 0) return;
    let tween = this.scene.tweens.add({
      targets: ship,
      alpha: 1,
      duration: time,
      ease: "Power1",
      onComplete: () => {
        tween.remove();
      },
    });
  }

  hideShip(ship, time = 1000) {
    //animazione di copertura delle navi
    //console.log(ship);
    if (ship.data.hp <= 0) return;
    let tween = this.scene.tweens.add({
      targets: ship,
      alpha: 0.00000001,
      duration: time,
      ease: "Power1",
      onComplete: () => {
        tween.remove();
      },
    });
  }

  dropBomb(x, y, angle) {
    let bomb = this.scene.add.sprite(x, y, "bomb");
    bomb.setScale(0.35, 0.35);
    bomb.setAngle(Phaser.Math.RadToDeg(angle));

    //console.log(bomb);

    this.scene.tweens.add({
      targets: bomb,
      scaleX: 0,
      scaleY: 0,
      duration: 1500,
      ease: "Power1",
      onComplete: function () {
        bomb.destroy();
      },
    });
  }
}
