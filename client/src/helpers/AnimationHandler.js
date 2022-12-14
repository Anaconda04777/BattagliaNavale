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

    this.scene.socket.emit("shipSpotted", ship.data.id, true);
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

    this.scene.socket.emit("shipSpotted", ship.data.id, false);
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
        bomb.scene.AnimationHandler.hitSplash(bomb.x, bomb.y);
        bomb.scene.socket.emit("hitSplash", bomb.x, bomb.y);
        bomb.destroy();
      },
    });
  }

  showItem(item, time = 1000) {
    let tween = this.scene.tweens.add({
      targets: item,
      alpha: 1,
      duration: time,
      ease: "Power1",
      onComplete: () => {
        tween.remove();
      },
    });
  }

  hideItem(item, time = 1000) {
    let tween = this.scene.tweens.add({
      targets: item,
      alpha: 0,
      duration: time,
      ease: "Power1",
      onComplete: () => {
        tween.remove();
      },
    });
  }

  waterSplash(x, y) {
    const particles = this.scene.add.particles("particles");
    const waterSplash = particles.createEmitter({
      x: x,
      y: y,
      speed: 100,
      scale: { start: 0.1, end: 0 },
      blendMode: "NORMAL",
      lifespan: 200,
      quantity: 1,
      alpha: { start: 1, end: 0 },
      angle: { min: 0, max: 360 },
      rotate: { min: 0, max: 360 },
      emitZone: { source: new Phaser.Geom.Circle(0, 0, 5) },
      tint: 0x2b6ca1,
    });
    console.log(waterSplash);
    waterSplash.explode(1000, x, y);
  }

  hitSplash(x, y) {
    const particles = this.scene.add.particles("particles");
    const fireSplash = particles.createEmitter({
      x: x,
      y: y,
      speed: 100,
      scale: { start: 0.1, end: 0 },
      blendMode: "NORMAL",
      lifespan: 200,
      alpha: { start: 1, end: 0 },
      angle: { min: 0, max: 360 },
      rotate: { min: 0, max: 360 },
      emitZone: { source: new Phaser.Geom.Circle(0, 0, 5) },
      tint: [0xffba08, 0xe85d04, 0xdc2f02],
    });
    console.log(fireSplash);
    fireSplash.explode(2000, x, y);
  }

  torpedoAnimation(bodyVelocityX, bodyVelocityY) {
    this.particles = this.scene.add.particles("particles");
    this.particles.depth = -1;
    this.particles.createEmitter({
      x: 0,
      y: 0,
      lifespan: 100,
      quantity: 100,
      speedX: -bodyVelocityX, //-this.body.velocity.x,
      speedY: -bodyVelocityY, //-this.body.velocity.y,
      scale: { start: 0.1, end: 0 },
      emitZone: { source: new Phaser.Geom.Circle(0, 0, 5) },
      blendMode: "ADD",
    });
  }

  deathAnimation(shipX, shipY) {
    for (let i = 0; i < 3; i++) {
      let x = Phaser.Math.Between(shipX - 3, shipX + 3);
      let y = Phaser.Math.Between(shipY - 3, shipY + 3);
      this.hitSplash(x, y);
    }
  }
}
