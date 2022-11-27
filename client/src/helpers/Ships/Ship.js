export default class Ship {
  constructor(scene, type, hp, x, y, ourShip, fuel, ability) {
    this.type = type;
    this.hp = hp;
    this.x = x;
    this.y = y;
    this.scene = scene;
    this.ourShip = ourShip;
    this.fuel = fuel;
    this.ability = ability;
    this.id = null;
    //console.log(this.id);
    this.isColliding = false;
    this.fuelCapacity = this.fuel;

    //indica se la prua della nave da verso l'alto (false) o verso destra/sinistra (true)
    this.dir = true;

    //console.log(sprite);
    this.bodyReference = scene.physics.add.staticSprite(x, y, type);

    //this.submarine.create(x, y, "Som");
    scene.add.existing(this.bodyReference);
    this.bodyReference.setInteractive();

    if (this.ourShip) {
      scene.input.setDraggable(this.bodyReference);
      scene.shipGroup.add(this.bodyReference);
      scene.physics.add.collider(
        this.bodyReference,
        scene.shipGroup,
        function (collider, self) {
          //console.log(self, collider);
          self.scene.InputHandler.movedShipIsColliding = true;
        }
      );
    }
    this.bodyReference.data = this;
    //console.log(this.bodyReference.body);
  }

  generateId() {
    let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }

  shipHit(danno) {
    this.hp -= danno;
    console.log("Ship hit: ", this.hp);
    this.scene.socket.emit("shipHit", danno, this.id);
    if (this.hp <= 0) {
      this.bodyReference.setActive(false);
      this.bodyReference.setVisible(false);
      this.bodyReference.setInteractive(false);
      console.log("ship destroyed");
    }
  }

  update() {
    //sposto la shape statica in base alla posizione della sprite
    //se la nave è in verticale devo invertire i fattori di sottrazione
    //aggiunta di fattori dovuto a bug della posizione dopo il movimento con gli angoli
    if (this.dir) {
      this.bodyReference.body.y = this.bodyReference.y - 10;
      this.bodyReference.body.x = this.bodyReference.x - 15;
    } else {
      this.bodyReference.body.y = this.bodyReference.y - 15;
      this.bodyReference.body.x = this.bodyReference.x - 10;
    }
  }

  changeAngle(angle, dir) {
    //quando cambio angolo salvo la direzione della nave
    this.dir = dir;

    //cambio l'angolo dello sprite
    this.bodyReference.setAngle(angle);
    //cambio il size della shape statica così da farla combaciare con la sprite
    //inverto le coordinate se la nave è in verticale
    this.bodyReference.body.setSize(
      dir ? this.bodyReference.width : this.bodyReference.height,
      dir ? this.bodyReference.height : this.bodyReference.width
    );

    //console.log(this.bodyReference.body);
  }

  //funzione che viene chiamata quando la nave viene spostata
  //controllo di non star mettendo una nave sopra ad un'altra
  //faccio il controllo su più coordinate diverse perché è un po' buggato
  checkOverlapping(x, y) {
    //console.log("sto testando: " + x + ", " + y);
    return (
      this.bodyReference.body.hitTest(x, y) ||
      this.bodyReference.body.hitTest(x + 15, y + 15) ||
      this.bodyReference.body.hitTest(x - 15, y - 15) ||
      this.bodyReference.body.hitTest(x + 15, y - 15) ||
      this.bodyReference.body.hitTest(x - 15, y + 15)
    );
  }
}
