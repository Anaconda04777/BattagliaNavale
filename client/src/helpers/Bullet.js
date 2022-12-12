export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "bullet");
    this.scene = scene;
    //assegno un id al proiettile preso da un generatore nella classe LogicHandler
    this.id = scene.LogicHandler.generateId();
    //console.log(arriveCoordinate);
  }

  //quando il proiettile viene sparato
  fire(x, y, angle, collisionObject, danno, texture) {
    //setto la scala
    this.texture = texture;
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

    //setto la texture
    console.log(texture);
    if (texture != "bullet") {
      this.setTexture(texture);
      this.setScale(0.4, 0.4);

      this.particles = this.scene.add.particles("particles");

      this.particles.createEmitter({
        x: 0,
        y: 0,
        lifespan: 100,
        quantity: 100,
        speedX: -this.body.velocity.x,
        speedY: -this.body.velocity.y,
        scale: { start: 0.1, end: 0 },
        emitZone: { source: new Phaser.Geom.Circle(0, 0, 5) },
        blendMode: "ADD",
      });
    }

    this.scene.socket.emit("bulletShot", x, y, angle, this.id, texture);

    //setto i collider del proiettile
    //se collide con la nave (collisionObject sarà per forza una nave)
    if (collisionObject != undefined) {
      this.scene.physics.add.collider(
        this,
        collisionObject,
        //callback che viene chiamata quando il proiettile collide con la nave
        function (bullet, collider) {
          console.log(bullet);
          //animazione particellare colpo
          bullet.scene.AnimationHandler.hitSplash(bullet.x, bullet.y);
          bullet.scene.socket.emit("hitSplash", bullet.x, bullet.y);
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
      if (texture != "bullet") return;
      this.scene.physics.add.collider(
        this,
        this.scene.collider,
        //callback che viene chiamata quando il proiettile collide con il collider (acqua)
        function (bullet, collider) {
          //console.log(bullet);
          //animazione particellare acqua
          bullet.scene.AnimationHandler.waterSplash(bullet.x, bullet.y);
          bullet.scene.socket.emit("waterSplash", bullet.x, bullet.y);
          //chiamo la funzione che dice al server che il proiettile è stato distrutto
          bullet.destructionSignal(bullet);
          bullet.destroy();
          collider.destroy();
        }
      );
    }
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
      this.destructionSignal(this);
      this.destroy();
    }

    if (this.texture != "bullet") {
      this.particles.setPosition(this.x, this.y);
      //this.particles.setSpeed(this.body.velocity.x, this.body.velocity.y);
    }
  }

  //mando il segnale al server che il proiettile è stato distrutto
  destructionSignal(bullet) {
    //console.log(bullet.particles);
    if (bullet.particles) bullet.particles.emitters.list[0].stop();
    //console.log("bulletDestruction: ", bullet);
    bullet.scene.socket.emit("bulletDestruction", bullet.id);
    if (bullet.scene.cruiserAbilityActive > 0) {
      bullet.scene.cruiserAbilityActive--;
      this.scene.cantFocusAbiliyActive = true;
      this.scene.alreadyFired = false;
      return;
    }
    bullet.scene.socket.emit("changeTurn");
    bullet.scene.GameHandler.changeTurn();
  }
}
