import ZoneHandler from "./ZoneHandler";
import "regenerator-runtime/runtime";

export default class LogicHandler {
  constructor(scene) {
    this.myZone = new ZoneHandler(scene);

    //creo la zona in cui piazzero le navi
    //così facendo impedisco che le navi vengano piazzate fuori dal campo
    scene.myZone = this.myZone.renderZone(
      //posizione della render zone
      scene.scale.width / 4,
      scene.scale.height / 2 - 13
    );

    //bordo della zona (TODO: togliere))
    //this.myZone.renderOutline(scene.myZone);

    //collider che distruggerà il proiettile quando finirà in acqua
    this.missCollider = (x, y) => {
      scene.collider = scene.physics.add
        .staticSprite(5, 5, "")
        //invisible ovviamente
        .setVisible(false)
        .setScale(0.5, 0.5);

      //setto la posizione del collider (data in base a dove ho cliccato)
      scene.collider.x = x;
      scene.collider.y = y;
      //aggiorno il collider
      scene.collider.body.updateFromGameObject();

      //rimuovo il collider dopo un po'
      //potrebbe capitare che il collider non sparisca quando viene colpito
      removeThis(scene.collider);
    };

    this.checkShipMovementWithConsumables = (dir, ship, mov, isColliding) => {
      //console.log(ship.x, ship.y);

      if (dir) {
        ship.x += mov;
        //fattore di incremento (o decremento) in base a dove mi sposto con la nave
        if (isColliding) ship.x -= mov + mov > 0 ? 1 : -1;
      } else {
        ship.y += mov;
        if (isColliding) ship.y -= mov + mov > 0 ? 1 : -1;
      }
      scene.InputHandler.movedShipIsColliding = false;

      if (ship.y < 73) ship.y = 73;
      if (ship.x > scene.scale.width / 2) ship.x = scene.scale.width / 2;
      if (ship.y > 664) ship.y = 664;
      if (ship.x < 0) ship.x = 0;

      //aggiorno la posizione della nave
      ship.data.update();
      /*if (
        this.x < 0 ||
        this.x > this.scene.game.config.width ||
        this.y < 0 ||
        this.y > this.scene.game.config.height
      )*/
    };

    //controllo che il proiettile (o l'aereo) non siano visibili nel campo nemico (quando lui spara)
    this.checkVisibilitiOfBullet = (object) => {
      if (Object.keys(object).length > 0) {
        Object.values(object).map((item) => {
          if (item.x > scene.scale.width / 2) {
            item.visible = false;
          } else item.visible = true;
        });
      }
    };

    this.generateId = () => {
      let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      };
      //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
      return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4();
    };

    //funzione asincrona che rimuove oggetto dopo un po'
    async function removeThis(obj) {
      await new Promise((resolve) => setTimeout(resolve, 15000));
      obj.destroy();
    }
  }
}
