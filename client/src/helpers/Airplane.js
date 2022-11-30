export default class Airplane extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "airplane");
    this.id = scene.LogicHandler.generateId();
    this.animationPlayer = scene.AnimationHandler;
    this.scene = scene;
  }

  onFlight(target, angle, x, y) {
    //console.log(this.scene.carrierAbilityActive);
    this.itsSpottingAircraft = this.scene.carrierAbilityActive;
    //resetto la posizione del proiettile, nel caso andasse furi dal canvas
    this.body.reset(x, y);
    //lo attivo e lo rendo visibile
    this.setActive(true);
    this.setVisible(true);

    this.setScale(0.3, 0.3);

    //setto la rotazione con l'angolo dato (quello tra la nave ammiraglia e dove ho cliccato) in gradi
    this.setAngle(Phaser.Math.RadToDeg(angle));

    console.log(this);
    //setto la velocita
    //this.scene.physics.moveTo
    this.scene.physics.velocityFromRotation(
      angle,
      this.scene.AirplaneHandler.planeVelocity,
      this.body.velocity
    );

    //console.log(this.itsSpottingAircraft);
    if (!this.itsSpottingAircraft) {
      //setto i collider del proiettile
      if (target != null) {
        this.collider = this.scene.physics.add.collider(
          this,
          target,
          //callback che viene chiamata quando il proiettile collide con la nave
          function (plane, collider) {
            //console.log(collider);
            try {
              if (this.bombAlreadyDropped) return;
              plane.explodePromise(collider);
              this.bombAlreadyDropped = true;
              //plane.targetReached(plane);
            } catch (e) {
              console.log(e);
            }
            plane.dropBombCoordinate(plane, angle);
          }
        );
        //fondamentale. Evita la collisione con l'oggetto
      } else {
        this.collider = this.scene.physics.add.collider(
          this,
          this.scene.collider,
          //callback che viene chiamata quando il proiettile collide con il collider (acqua)
          function (plane, collider) {
            //console.log(bullet);
            if (this.bombAlreadyDropped) return;
            this.bombAlreadyDropped = true;
            plane.dropBombCoordinate(plane, angle);
            //plane.targetReached(plane);
          }
        );
      }
    } else {
      console.log(this.width, this.height);
      this.body.setSize(500, 500);

      this.collider = this.scene.physics.add.collider(
        this,
        this.scene.enemyShipGroup,
        function (plane, collider) {
          //console.log(collider);
          //impedisco che il sottomarino venga spottato dall'aereo
          if (collider.data.type === "Som") return;
          plane.animationPlayer.showShip(collider);
          plane.scene.shipSpottedWithAircraft.push(collider);
          //console.log(plane.scene.shipSpottedWithAircraft);
        }
      );
    }

    this.collider.overlapOnly = true;

    this.scene.socket.emit("airplaneOnFlight", x, y, angle, this.id);
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
      this.targetReached(this);
      //this.destroy();
    }
  }

  targetReached(plane) {
    //console.log("planeDestruction: ", plane);
    if (plane.scene.cruiserAbilityActive > 0) {
      plane.scene.cruiserAbilityActive--;
      this.scene.cantFocusAbiliyActive = true;
      this.scene.alreadyFired = false;
      return;
    }

    plane.scene.socket.emit("changeTurn");
    plane.scene.GameHandler.changeTurn();
    plane.destroy();
  }

  async dropBombCoordinate(plane, angle) {
    console.log("dropBombCoordinate");
    await new Promise((resolve) => setTimeout(resolve, 50));

    plane.animationPlayer.dropBomb(plane.x, plane.y, angle - Math.PI / 2);
    plane.scene.socket.emit("bombDropped", plane.x, plane.y, angle);
  }

  async explodePromise(collider) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    collider.data.shipHit(1);
  }
}
