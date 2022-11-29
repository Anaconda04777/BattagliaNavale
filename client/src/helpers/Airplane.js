export default class Airplane extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "airplane");
    this.id = scene.LogicHandler.generateId();
    this.animationPlayer = scene.AnimationHandler;
    this.scene = scene;
  }

  onFlight(target, angle, x, y, itsSpottingAircraft) {
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
            console.log(collider);

            plane.dropBombCoordinate(plane, angle);
            try {
              if (this.bombAlreadyDropped) return;
              collider.data.shipHit(1);
              this.bombAlreadyDropped = true;
              plane.targetReached(plane);
            } catch (e) {
              console.log(e);
            }
          }
        );
        //fondamentale. Evita la collisione con l'oggetto
      } else {
        this.collider = this.scene.physics.add.collider(
          this,
          this.scene.collider,
          //callback che viene chiamata quando il proiettile collide con il collider (acqua)
          function (plane, collider) {
            plane.dropBombCoordinate(plane, angle);
            //console.log(bullet);
            //chiamo la funzione che dice al server che il proiettile è stato distrutto
            if (this.bombAlreadyDropped) return;
            this.bombAlreadyDropped = true;
            plane.targetReached(plane);
            collider.destroy();
          }
        );
      }
    } else {
      console.log(this.width, this.height);
      this.body.setSize(200, 200);

      this.collider = this.scene.physics.add.collider(
        this,
        this.scene.enemyShipGroup,
        function (plane, collider) {
          plane.animationPlayer.showShip(collider);
          plane.scene.shipSpottedWithAircraft.push(collider);
          //console.log(plane.scene.shipSpottedWithAircraft);
        }
      );
    }

    this.collider.overlapOnly = true;

    this.scene.socket.emit("airplaneOnFlight", x, y, angle, this.id);

    this.dropBombCoordinate = (plane, angle) => {
      let randomBomb = [
        plane.x + Phaser.Math.Between(-5, 5),
        plane.y + Phaser.Math.Between(-5, 5),
      ];
      plane.animationPlayer.dropBomb(randomBomb[0], randomBomb[1], angle);
      plane.scene.socket.emit(
        "bombDropped",
        randomBomb[0],
        randomBomb[1],
        angle
      );
    };
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
      if (this.itsSpottingAircraft) this.targetReached(this);
      //lo riciclo
      this.setActive(false);
      this.setVisible(false);
      //resetto il size della shapeCollision
      this.body.setSize(40, 54);
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
  }
}
