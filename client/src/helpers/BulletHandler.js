import Bullet from "./Bullet";

export default class BulletHandler extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
    this.scene = scene;
    this.bulletVelocity = 300;
    this.reloadBullet();
  }

  //sparo un proiettile
  fireBullet(x, y, angle, collisionObject, danno) {
    //prende il primo elemento del gruppo con active false

    //se il gruppo di proiettili è vuoto (sono stati tutti sparati) ricarico il gruppo
    if (this.children.size === 0) this.reloadBullet();

    //prendo il primo proiettile disponibile
    const bullet = this.getFirstDead(false);

    if (bullet) {
      //passo la posizione dell'ammiragli, l'angolo e la nave con cui colliderà
      this.scene.bulletInGame++;
      bullet.fire(x, y, angle, collisionObject, danno);
    }
  }

  reloadBullet() {
    //creo un pull di 30 proiettili
    this.createMultiple({
      frameQuantity: 30,
      key: "bullet",
      active: false,
      visible: false,
      //creo più istanze di bullet
      classType: Bullet,
    });
  }
}
