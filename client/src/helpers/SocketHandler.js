import io from "socket.io-client";

export default class SocketHandler {
  constructor(scene) {
    scene.socket = io("http://localhost:3000");
    //console.log(scene.socket);

    scene.enemyBullet = {};

    //quando mi connetto al server assgno al player un id
    scene.socket.on("connect", () => {
      scene.player.player.id = scene.socket.id;
      //scene.socket.emit("newPlayer", scene.socket.id);
      console.log("Connected to server with id: " + scene.socket.id);
    });

    //assegno numero di giocatore e gli id delle navi
    //shipsId fornisce i due pacchetti di id per i giocatori
    scene.socket.on("assegnaDati", (num, shipsId) => {
      //salvo il numero del player
      scene.playerNum = num;
      //do all'array shipsId i valori ricevuti dal server (due liste con gli id delle navi)
      let arrayShips = shipsId;

      //assegno gli id alle navi del player
      //ciclo ogni nave e in base all'indice assegno l'id corrispondente
      Object.entries(scene.player.player.flotta).map((item, i) => {
        //console.log(shipsId);
        item[1].id = arrayShips[scene.playerNum - 1][i];
      });

      //rimuovo la lista di id che ho appena messo, corrispondente al nuemro del player
      arrayShips.splice(scene.playerNum - 1, 1);

      //sicuramente ciò che resta è il secondo pacchetto di id delle navi avversarie
      Object.entries(scene.player.opponent.flottaNemica).map((item, i) => {
        //console.log(shipsId);
        item[1].id = arrayShips[0][i];
      });
      console.log("Player number: " + scene.playerNum);
      console.log(scene.player);
    });

    //quando si connette un nuovo player, mi assicuro di prenderne l'id
    scene.socket.on("newPlayer", (players) => {
      //ciclo l'oggetto che contiene gli oggetti di entrambi i player
      Object.entries(players).map((item) => {
        //se l'id del player è diverso dal mio, allora è l'avversario
        //controllo che non sia nullo
        if (item.id != scene.player.player.id && item.id != null) {
          scene.player.opponent.id = item.id;
          console.log("Opponent id: " + scene.player.opponent.id);
        }
      });
    });

    //quando l'avversario è pronto, aggirno la variabile ready nel suo oggetto
    scene.socket.on("opponentReady", () => {
      console.log("opponent ready");
      //il nemico si è prontato, quindi posso iniziare
      scene.player.opponent.ready = true;
      //coloro il cercihio che indica che il nemico è pronto
      scene.enemyReady.setFillStyle(0x00ff00);
    });

    //intercetto il messaggio di inizio partita inviato da server
    //avviene se entrambi i giocatori sono pronti
    scene.socket.on("start", () => {
      console.log("start game");
      scene.gameStarted = true;
    });

    scene.socket.on("changeTurn", () => {
      console.log("change turn");
      scene.GameHandler.changeTurn();
    });

    //scelgo un player random per iniziare
    scene.socket.on("chooseRandomStarterPlayer", (id) => {
      //estrazione fatta dal server, invia a tutti l'id del palyer che inizierà
      if (scene.player.player.id == id) {
        //se è il mio setto il turno a true
        //rendo il testo del turno visibile e lo imposto a mio turno
        scene.GameHandler.changeTurn(true);
        scene.isMyTurnText.visible = true;
      } else {
        //se è quello avversario setto il turno a false
        //rendo il testo del turno visibile e lo imposto a turno avversario
        scene.GameHandler.changeTurn(false);
        scene.isMyTurnText.visible = true;
      }
    });

    //intercetto il messaggio inviato dal server che mi indica che l'avversario ha mosso una nave
    scene.socket.on("shipMovement", (x, y, shipId) => {
      //console.log("shipMovement: " + x + ", " + y + ", " + shipId);

      let movingShip = this.searchShipWithId(
        shipId,
        scene.player.opponent.flottaNemica
      );

      //assegno le coordinate alla nave trovata
      movingShip.bodyReference.x = scene.scale.width - x;
      movingShip.bodyReference.y = y;
      //aggiorno il collider della nave
      movingShip.update();
    });

    //cambio la direzione in cui è rivolta la nave
    scene.socket.on("changeDirection", (shipId, angle, dir) => {
      //console.log("changeDirection: " + angle + ", " + shipId);
      let movingShip = this.searchShipWithId(
        shipId,
        scene.player.opponent.flottaNemica
      );

      //cambio la direzione della nave
      //chiamo la funzione che se ne occupda direttamente nella classe ship
      movingShip.changeAngle(angle, dir);

      //in base alla direzione flippo la texture della nave
      //(di base le navi avversarie hanno la texture flippata, ma se la nave è stata girata in verticale, devo rimetterla come era)
      dir
        ? (movingShip.bodyReference.flipX = true)
        : (movingShip.bodyReference.flipX = false);
    });

    //intercetto il messaggio inviato dal server che mi indica che l'avversario ha sparato
    scene.socket.on("bulletShot", (x, y, angle, bulletId) => {
      //starting x and y
      //console.log("bulletShot: " + x + ", " + y + ", " + angle);
      //creo il proiettile sparato dall'avversario
      let bullet = scene.physics.add.sprite(scene.scale.width - x, y, "bullet");
      //imposto la rotazione del proiettile (l'angolo è dato in radianti)
      //essendo nemico devo invertire l'angolo
      bullet.setAngle(-Phaser.Math.RadToDeg(angle));
      //lo flippo per farlo puntare nella direzione giusta
      bullet.flipX = true;
      //TODO: sistemare scala proiettile

      //console.log(bulletId);
      //setto la velocità del proiettile (con angolo e velocita invertiti)
      scene.physics.velocityFromRotation(
        -angle,
        -scene.BulletHandler.bulletVelocity,
        bullet.body.velocity
      );

      //aggiungo l'id proiettile alla lista dei proiettili (id chiave, oggetto valore)
      scene.enemyBullet[bulletId] = bullet;
    });

    //intercetto il messaggio inviato dal server che mi indica che il proiettile ha colpito qualcosa
    //in questo caso lo distruggo
    scene.socket.on("bulletDestruction", (bulletId) => {
      //il server mi ha dato l'id del proiettile distrutto
      //lo cerco nella lista dei proiettili e lo distruggo
      scene.enemyBullet[bulletId].destroy();
      //lo rimuovo dalla lista
      delete scene.enemyBullet[bulletId];
    });

    //intercetto il messaggio inviato dal server che mi indica che l'avversario ha colpito una nave
    scene.socket.on("shipHit", (danno, shipId) => {
      //cerco la nave colpita
      let hitShip = this.searchShipWithId(shipId, scene.player.player.flotta);
      console.log(hitShip);
      //aggiorno la vita della nave
      if (hitShip) hitShip.shipHit(danno);
      //se la vita è 0, la nave è distrutta
    });

    //ship abilities
    //intercetto il messaggio inviato dal server che mi indica che l'avversario ha usato una abilità
    scene.socket.on("battleshipAbility", (shipId, hp) => {
      let ship = this.searchShipWithId(
        shipId,
        scene.player.opponent.flottaNemica
      );
      ship.hp = hp;
      console.log("battleshipAbility", ship);
    });

    scene.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    scene.socket.on("message", (message) => {
      console.log(message);
    });
    scene.socket.on("gameState", (gameState) => {
      console.log(gameState);
    });

    this.searchShipWithId = (shipId, obj) => {
      let searchedShip;
      //ciclo le navi per trovare quella con l'id ricevuto (ovvero quella che si è mossa)
      //(le chiavi delle navi non sono i loro id ma il loro tipo di nave)
      Object.entries(obj).map((item) => {
        if (item[1].id == shipId) {
          searchedShip = item[1];
          return;
        }
      });
      return searchedShip;
    };
  }
}
