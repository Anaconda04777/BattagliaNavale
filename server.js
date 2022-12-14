const server = require("express")();
const http = require("http").createServer(server);
const serveStatic = require("serve-static");
const path = require("path");
const cors = require("cors");

//genero una lista di 7 id (nuemro delle navi)
function getShipsId() {
  let shipsId = [];
  for (let i = 0; i < 7; i++) {
    let guid = () => {
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
    };
    shipsId.push(guid());
  }
  return shipsId;
}

//assegno i due pacchetti di id
const idShips1 = getShipsId();
const idShips2 = getShipsId();

const players = [
  {
    id: null,
    ready: false,
    readyToRestart: false,
  },
  {
    id: null,
    ready: false,
    readyToRestart: false,
  },
];
let numPlayers = 0;

const io = require("socket.io")(http, {
  //consento la comuniazione con il client dal nostro server
  cors: {
    //mettere link della distribuzione (farlo anche nel sockethandler)
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

server.use(cors());
server.use(serveStatic(__dirname + "/client/dist"));

//quando un client si connette
io.on("connection", function (socket) {
  //se ci sono troppi player, non li accetto
  if (numPlayers > 1) {
    console.log("Too many players!");
    socket.disconnect();
  } else {
    numPlayers++;
    console.log("Player connected: " + numPlayers + ", with id: " + socket.id);
    //assegno l'id del player in base al numero di giocatori (id assegnato automaticamente da socket.io)
    players[numPlayers - 1].id = socket.id;

    //console.log("player ships: " + playerShips + " enemy ships: " + enemyShips);

    //mando i pacchetti di id alle due navi, con il numero del player corrente
    socket.emit("assegnaDati", numPlayers, [idShips1, idShips2]);
    console.log(numPlayers);
    //assegno id all'oppo
    socket.emit("newPlayer", players);
    socket.broadcast.emit("newPlayer", players);
  }

  //dico all'altro client che uno ?? pronto
  socket.on("ready", (id) => {
    console.log(id);
    socket.broadcast.emit("opponentReady");

    //mappo l'oggetto players e segno pronto il player che ha mandato il messaggio (tramite il suo id)
    let count = 0;
    players.map((item) => {
      if (item.id == id) {
        item.ready = true;
      }
      if (item.ready) {
        //mi segno quanti sono pronti
        count++;
      }
    });
    console.log(players);
    //se entrambi sono pronti, inizio la partita
    if (count == 2) {
      console.log("All players are ready");
      //mando il messaggio di start
      socket.broadcast.emit("start");
      socket.emit("start");
      //scelgo chi inizia
      chooseRandomStarterPlayer();
    }
  });

  //aggiorno l'altro client
  //movimento navi
  socket.on("shipMovement", (x, y, shipId) => {
    socket.broadcast.emit("shipMovement", x, y, shipId);
  });

  socket.on("changeDirection", (shipId, angle, dir) => {
    socket.broadcast.emit("changeDirection", shipId, angle, dir);
  });

  //proiettili
  socket.on("bulletShot", (x, y, angle, bulletId, texture) => {
    socket.broadcast.emit("bulletShot", x, y, angle, bulletId, texture);
  });

  socket.on("bulletDestruction", (bulletId) => {
    socket.broadcast.emit("bulletDestruction", bulletId);
  });

  socket.on("airplaneOnFlight", (x, y, angle, airplaneId) => {
    socket.broadcast.emit("airplaneOnFlight", x, y, angle, airplaneId);
  });

  socket.on("bombDropped", (x, y, angle) => {
    socket.broadcast.emit("bombDropped", x, y, angle);
  });

  //navi colpite
  socket.on("shipHit", (danno, shipId) => {
    socket.broadcast.emit("shipHit", danno, shipId);
  });

  //-----------------------------------------

  //ship abilities
  socket.on("battleshipAbility", (shipId, hp) => {
    socket.broadcast.emit("battleshipAbility", shipId, hp);
  });

  socket.on("shipSpotted", (shipId, isSpotted) => {
    socket.broadcast.emit("shipSpotted", shipId, isSpotted);
  });

  //-----------------------------------------

  //animation
  socket.on("hitSplash", (x, y) => {
    socket.broadcast.emit("hitSplash", x, y);
  });

  socket.on("waterSplash", (x, y) => {
    socket.broadcast.emit("waterSplash", x, y);
  });

  socket.on("changeTurn", () => {
    socket.broadcast.emit("changeTurn");
  });

  socket.on("gameOver", () => {
    socket.broadcast.emit("gameOver");
  });

  socket.on("readyToRestart", (id) => {
    let count = 0;
    players.map((item) => {
      if (item.id == id) {
        item.readyToRestart = true;
      }
      if (item.readyToRestart) {
        count++;
      }
    });
    if (count == 2) {
      console.log("All players are ready to restart");
      socket.broadcast.emit("readyToRestart");
      socket.emit("readyToRestart");
    }
  });

  socket.on("disconnect", function () {
    numPlayers--;

    Object.entries(players).map((item) => {
      if (item[1].id == socket.id) {
        console.log(item);
        item[1].ready = false;
      }
    });
    console.log("user disconnected: " + socket.id);
  });

  //funzione che sceglie a caso chi inizia
  chooseRandomStarterPlayer = () => {
    const randomElement = players[Math.floor(Math.random() * players.length)];

    socket.emit("chooseRandomStarterPlayer", randomElement.id);
    socket.broadcast.emit("chooseRandomStarterPlayer", randomElement.id);
  };
});

const port = process.env.PORT || 3000;

http.listen(port, function () {
  console.log("Server started!");
});
