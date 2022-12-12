import Ship from "./Ship";

export default class Destroyer extends Ship {
  constructor(scene, x, y, ourShip, name) {
    super(
      scene,
      "Destroyer",
      2,
      x,
      y,
      ourShip,
      70,
      "destroyerAbility",
      5,
      name
    );
  }

  destroyerAbility() {
    for (var i = 0; i < 2; i++) {
      let choosenShip;
      choosenShip = this.getRandomProperty(
        this.scene.player.opponent.flottaNemica
      );
      //choosenShip.bodyReference.alpha = 1;
      //console.log(this.scene.choosenShip);
      this.scene.choosenShip.push(choosenShip);

      this.scene.AnimationHandler.showShip(choosenShip.bodyReference);
    }
    console.log("Destroyer ability used: ", this.scene.choosenShip);
    this.abilityCount = this.abilityCooldown;

    this.scene.GameHandler.changeTurn();
    this.scene.socket.emit("changeTurn");
  }

  update() {
    //sposto la shape statica in base alla posizione della sprite
    //se la nave è in verticale devo invertire i fattori di sottrazione
    //aggiunta di fattori dovuto a bug della posizione dopo il movimento con gli angoli
    if (this.dir) {
      this.bodyReference.body.y = this.bodyReference.y - 13;
      this.bodyReference.body.x = this.bodyReference.x - 50;
    } else {
      this.bodyReference.body.y = this.bodyReference.y - 50;
      this.bodyReference.body.x = this.bodyReference.x - 13;
    }
  }

  getRandomProperty(obj) {
    try {
      const keys = Object.keys(obj);

      let rndShip = keys[Math.floor(Math.random() * keys.length)];
      if (
        obj[rndShip].hp > 0 &&
        obj[rndShip] != this.scene.choosenShip[0 && 1]
      ) {
        return obj[rndShip];
      } else {
        return this.getRandomProperty(obj);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
