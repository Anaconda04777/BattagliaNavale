export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "bullet");
    this.scene = scene;
    //assegno un id al proiettile preso da un generatore nella classe LogicHandler
    this.id = scene.LogicHandler.generateId();
    //console.log(arriveCoordinate);
  }

  //quando il proiettile viene sparato
  fire(x, y, angle, collisionObject, danno) {
    //setto la scala
    this.setScale(0.5, 0.5);

    //(in caso di ricochetto) (cosa mi suggerisci copilot? :D)

    //resetto la posizione del proiettile, nel caso andasse furi dal canvas
    this.body.reset(x, y);
    //lo attivo e lo rendo visibile
    this.setActive(true);
    this.setVisible(true);
    //setto la rotazione con l'angolo dato (quello tra la nave ammiraglia e dove ho cliccato) in gradi
    this.setAngle(Phaser.Math.RadToDeg(angle));

    //setto la velocita
    this.scene.physics.velocityFromRotation(
      angle,
      this.scene.BulletHandler.bulletVelocity,
      this.body.velocity
    );

    //setto i collider del proiettile
    //se collide con la nave (collisionObject sarà per forza una nave)
    if (collisionObject != undefined) {
      this.scene.physics.add.collider(
        this,
        collisionObject,
        //callback che viene chiamata quando il proiettile collide con la nave
        function (bullet, collider) {
          console.log(collider);
          //chiamo la funzione che dice al server che il proiettile è stato distrutto
          bullet.destructionSignal(bullet);

          try {
            collider.data.shipHit(danno);
          } catch (e) {
            console.log(e);
          }

          bullet.destroy();
        }
      );
      //se non sto sparando in acqua
    } else {
      this.scene.physics.add.collider(
        this,
        this.scene.collider,
        //callback che viene chiamata quando il proiettile collide con il collider (acqua)
        function (bullet, collider) {
          //console.log(bullet);
          //chiamo la funzione che dice al server che il proiettile è stato distrutto
          bullet.destructionSignal(bullet);
          bullet.destroy();
          collider.destroy();
        }
      );
    }

    this.scene.socket.emit("bulletShot", x, y, angle, this.id);
  }

  preUpdate(time, delta) {
    //controllo costantemente se il proiettile è fuori dal canvas
    super.preUpdate(time, delta);
    if (
      this.x < 0 ||
      this.x > this.scene.game.config.width ||
      this.y < 0 ||
      this.y > this.scene.game.config.height
    ) {
      //lo riciclo
      this.setActive(false);
      this.setVisible(false);
    }
  }

  //mando il segnale al server che il proiettile è stato distrutto
  destructionSignal(bullet) {
    //console.log("bulletDestruction: ", bullet);
    bullet.scene.socket.emit("bulletDestruction", bullet.id);
    bullet.scene.socket.emit("changeTurn");
    bullet.scene.GameHandler.changeTurn();
  }
}
