import { Math } from "phaser";

export default class InputHandler {
  constructor(scene) {
    this.focus = "";
    this.shipInMovement = false;
    this.shipOver = false;
    scene.alreadyFired = false;
    this.movedShipIsColliding = false;
    //this.CVIsAboutToFire = false;

    scene.input.on("pointerdown", (pointer, gameObject) => {
      //controllo che il target del click non sia undefined
      //che non sia la zona del nostro campo
      //che non sia una nave avversaria
      //console.log(gameObject);
      if (gameObject[0] !== undefined) {
        if (gameObject[0].type != "Sprite") {
          return;
          //TODO: riguardare sta roba un po' strana
        } else if (gameObject[0].data.ourShip) return;

        //se sto tirando nell'acqua aggiungo l'oggetto che indicerà al bullet
        //dove sparare nell'acqua e farà si che si distrugga
      } else
        scene.isMyTurn &&
        scene.gameStarted &&
        !scene.alreadyFired &&
        !this.movedShipIsColliding
          ? scene.LogicHandler.missCollider(pointer.x, pointer.y)
          : null;

      //------------------------------------------------------------

      //se il target del click è una nave
      //se sto cliccando col tasto sinistro
      if (
        pointer.leftButtonDown() &&
        scene.isMyTurn &&
        scene.gameStarted &&
        !scene.alreadyFired &&
        !this.shipInMovement
      ) {
        scene.alreadyFired = true;
        //setto la posizione da cui partiranno i colpi, ovvero la nave ammiraglia
        //di default la battleship
        //TODO: se rimane solo il sottomarino, non puoi più sparare, puoi usare solo la sua abilità
        let naveAmmiraglia;
        if (
          scene.subAbilityActive ||
          scene.cruiserAbilityActive > 0 ||
          scene.cantFocusAbiliyActive ||
          scene.carrierAbilityActive
        ) {
          console.log(this.focus);
          naveAmmiraglia = [this.focus.x, this.focus.y];
        } else {
          Object.entries(scene.player.player.flotta)
            .reverse()
            .map((ship) => {
              //console.log(ship[1]);
              if (ship[1].hp > 0) {
                naveAmmiraglia = [
                  ship[1].bodyReference.x,
                  ship[1].bodyReference.y,
                  ship[1],
                ];
              }
            });
          /*if (ship[1].type == "AircraftCarrier") {
              this.CVIsAboutToFire = true;
            }*/
        }

        if (
          (naveAmmiraglia[2] && naveAmmiraglia[2].type == "AircraftCarrier") ||
          scene.carrierAbilityActive
        ) {
          scene.AirplaneHandler.spawnAirplane(
            gameObject[0],
            Math.Angle.Between(
              naveAmmiraglia[0],
              naveAmmiraglia[1],
              pointer.x,
              pointer.y
            ),
            naveAmmiraglia[0],
            naveAmmiraglia[1],
            scene.carrierAbilityActive
          );
          //this.CVIsAboutToFire = false;
        } else {
          //chiamo la funzione di sparo nella classe che gestisce i proiettili
          scene.BulletHandler.fireBullet(
            //gli passo la posizione della nave ammiraglia
            naveAmmiraglia[0],
            naveAmmiraglia[1],
            //l'angolo (in radianti) tra la nave ammiraglia e il punto cliccato
            Math.Angle.Between(
              naveAmmiraglia[0],
              naveAmmiraglia[1],
              pointer.x,
              pointer.y
            ),
            //la nave a cui sto sparando
            gameObject[0],
            //danno che fa il proiettile #TODO: l'abilità che cambia il danno del proiettile è quella del som
            scene.subAbilityActive ? 1000 : 1,
            scene.subAbilityActive ? "torpedo" : "bullet"
          );
        }
      }
    });

    scene.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      //chiamo il controllo per vedere se sto draggando la nave sopra ad un'altra
      this.shipOver = this.checkIfCollidingWithDragging(dragX, dragY);
      //sposto la nave
      gameObject.x = dragX;
      gameObject.y = dragY;
      //aggiorno il collider
      gameObject.data.update();

      //mando le informazioni al server sulla posizione in tempo reale della mia nave
      scene.socket.emit(
        "shipMovement",
        gameObject.x,
        gameObject.y,
        gameObject.data.id
      );

      //console.log(gameObject);
    });

    //stabilisco il focus sulla nave che ho cliccato
    scene.input.on("pointerdown", (pointer, gameObject) => {
      //console.log(gameObject[0]);
      //tengo il focus solo se ciò che ho cliccato è la mia nave

      if (gameObject[0] != undefined && !this.shipInMovement) {
        if (
          gameObject[0].type === "Sprite" &&
          gameObject[0].data.ourShip &&
          gameObject[0].data.hp > 0 &&
          !scene.subAbilityActive &&
          !scene.cantFocusAbiliyActive &&
          scene.cruiserAbilityActive === 0
        ) {
          if (scene.isMyTurn) {
            //tolgo il focus dall'icon
            Object.entries(scene.icon).map((icon) => {
              if (icon[1]) {
                console.log(icon);
                icon[1].clearTint();
              }
            });
            scene.UIHandler.abilitySelected = null;
            this.focus = gameObject[0];
            scene.UIHandler.showConsumables(
              this.focus.data.ability,
              this.focus
            );
          } else this.focus = gameObject[0];
        }
      }
    });

    //accedo agli eventi da tastiera
    scene.input.keyboard.on("keydown", (event) => {
      //console.log(this.focus);
      //try
      if (
        this.focus.data.ourShip &&
        (scene.isMyTurn || !scene.player.player.ready)
      ) {
        if (
          scene.gameStarted &&
          scene.isMyTurn &&
          !(scene.UIHandler.abilitySelected == "movement")
        )
          return;
        //freccia su per spostare il muso della nave in alto
        if (event.key === "ArrowUp") {
          //passo l'angolo alla funzione che ruota la nave (nella classe Ship)
          //passo la "direzione" (false se va in verticale, true se va in orizzontale)
          this.focus.data.changeAngle(-90, false);
          //comuncio al server la rotazione della nave, passando ovviamente l'id della nave che ha ruotato
          scene.socket.emit("changeDirection", this.focus.data.id, -90, false);
          if (
            scene.gameStarted &&
            scene.UIHandler.abilitySelected === "movement"
          ) {
            this.shipMovement(false, -1);
          }
        } else if (event.key === "ArrowDown") {
          //freccia giu per spostare il muso della nave in basso
          this.focus.data.changeAngle(90, false);
          scene.socket.emit("changeDirection", this.focus.data.id, 90, false);
          if (
            scene.gameStarted &&
            scene.UIHandler.abilitySelected === "movement"
          ) {
            this.shipMovement(false, 1);
          }
        } else if (event.key === "ArrowLeft") {
          //freccia sinistra per spostare il muso della nave verso sinistra
          this.focus.data.changeAngle(180, true);
          scene.socket.emit("changeDirection", this.focus.data.id, 180, true);
          if (
            scene.gameStarted &&
            scene.UIHandler.abilitySelected === "movement"
          ) {
            this.shipMovement(true, -1);
          }
        } else if (event.key === "ArrowRight") {
          //freccia destra per spostare il muso della nave verso destra
          this.focus.data.changeAngle(0, true);
          scene.socket.emit("changeDirection", this.focus.data.id, 0, true);

          if (
            scene.gameStarted &&
            scene.UIHandler.abilitySelected === "movement"
          ) {
            this.shipMovement(true, 1);
          }
        }
      }
      // }
      /*} catch (error) {
        console.log(error);
      }*/
    });

    //quando rilascio il click
    scene.input.on("dragend", (pointer, gameObject, dropped) => {
      //se la nave è stata droppata su un'altra nave oppure fuori dal nostro campo
      if (!dropped || this.shipOver) {
        //la posizione della nave viene resettata alla posizione iniziale
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
        //aggiorno il collider
        gameObject.data.update();

        //mando al server la posizione iniziale della nave (questo perché il server ha visto che l'avevo mossa)
        scene.socket.emit(
          "shipMovement",
          gameObject.x,
          gameObject.y,
          gameObject.data.id
        );
      }
    });

    //quando clicco sul tasto per iniziare
    scene.readyButton.on("pointerdown", () => {
      //dico al server che sono pronto
      scene.socket.emit("ready", scene.player.player.id);
      //nascondo il tasto e lo disabilito
      scene.readyButton.disableInteractive();
      scene.readyButton.visible = false;

      console.log(scene.imReady);

      //color il cerchio che indica che sono pronto
      scene.imReady.setFillStyle(0x00ff00);
      //aggiorno la variabile che indica se sono pronto nel mio oggetto
      scene.player.player.ready = true;
      this.disableDrag();
    });

    this.shipMovement = (dir, vel) => {
      if (!this.shipInMovement) {
        this.shipInMovement = true;
        scene.icon.movementIcon.disableInteractive();
      }

      if (this.focus.data.fuel > 0) {
        scene.LogicHandler.checkShipMovementWithConsumables(
          dir,
          this.focus,
          vel,
          this.movedShipIsColliding
        );
        this.focus.data.fuel--;
        scene.socket.emit(
          "shipMovement",
          this.focus.x,
          this.focus.y,
          this.focus.data.id
        );
      } else {
        this.focus.data.fuel = this.focus.data.fuelCapacity;

        scene.GameHandler.changeTurn();
        scene.socket.emit("changeTurn");
        this.shipInMovement = false;
        return;
      }
    };

    //quando sono pronto a giocare disabilito il drag delle navi
    this.disableDrag = () => {
      scene.input.off("drag");
      scene.input.off("dragend");
    };

    //controllo se le navi si sovrappongono
    this.checkIfCollidingWithDragging = (x, y) => {
      let count = 0;
      //guardo ogni nave del gruppo delle nostre navi e controllo quante si sovrappongono
      //per farlo chiamo la funzione predisposta sulla nave
      scene.shipGroup.children.iterate((child) => {
        if (child.data.checkOverlapping(x, y)) count++;
      });
      //se sono più di 1 vuol dire che la nave che sto droppando è sopra ad un'altra
      //una è di default perché conta anche la nave stessa che sto spostando
      return count > 1 ? true : false;
    };

    //quando le navi si sovrappongono a causa dello spostamento
    /*this.checkIfCollidingWithMovement = (ship, movement) => {
      ship.data.checkOverlapping()
*/
  }
}
