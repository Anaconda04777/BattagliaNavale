export default class AnimationHandler {
  constructor(scene) {
    this.scene = scene;
  }

  showShip(ship) {
    //e fare il tween opposto
    let tween = this.scene.tweens.add({
      targets: ship,
      alpha: 1,
      duration: 1000,
      ease: "Power1",
      onComplete: () => {
        tween.remove();
      },
    });
  }

  hideShip(ship) {
    //e fare il tween opposto
    let tween = this.scene.tweens.add({
      targets: ship,
      alpha: 0.00000001,
      duration: 1000,
      ease: "Power1",
      onComplete: () => {
        tween.remove();
      },
    });
  }

  dropBomb(x, y, angle) {
    let bomb = this.scene.add.sprite(x, y, "bomb");
    bomb.setScale(0.2, 0.2);
    bomb.setAngle(Phaser.Math.RadToDeg(angle) - 90);

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
