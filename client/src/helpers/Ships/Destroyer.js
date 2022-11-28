import Ship from "./Ship";

export default class Destroyer extends Ship {
  constructor(scene, x, y, ourShip) {
    super(scene, "Destroyer", 1, x, y, ourShip, 50, "destroyerAbility", 1);
  }

  destroyerAbility() {
    for (var i = 0; i < 2; i++) {
      let choosenShip;
      choosenShip = this.getRandomProperty(
        this.scene.player.opponent.flottaNemica
      );
      choosenShip.bodyReference.alpha = 1;
      //console.log(this.scene.choosenShip);
      this.scene.choosenShip.push(choosenShip);
      /*this.scene.tweens.add({
        targets: choosenShip.bodyReference,
        alpha: 0,
        duration: 1000,
        ease: "Power1",
        yoyo: true,
        repeat: 0,
        onComplete: () => {
          choosenShip.bodyReference.alpha = 1;
          choosenShip.bodyReference.depth = 0;
        },
      });*/
    }
    console.log("Destroyer ability used: ", this.scene.choosenShip);
    this.abilityCount = this.abilityCooldown;

    this.scene.GameHandler.changeTurn();
    this.scene.socket.emit("changeTurn");
  }

  getRandomProperty(obj) {
    const keys = Object.keys(obj);

    let rndShip = keys[Math.floor(Math.random() * keys.length)];
    if (obj[rndShip].hp > 0) {
      return obj[rndShip];
    } else {
      return this.getRandomProperty(obj);
    }
  }
}
