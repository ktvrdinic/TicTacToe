const { v4: uuidv4 } = require("uuid");

var dataPlayer = { username: "Marko", noWin: 0, noLose: 0, noTie: 0 };
var dataGame = [
  {
    ID: 1,
    title: "Game1",
    playersPlayed: [{ username: "Marko" }, { username: "Marin" }],
  },
  {
    ID: 2,
    title: "Game2",
    playersPlayed: [{ username: "Karlo" }],
  },
];

module.exports = function (app) {
  app.get("/", (req, res) => {
    res.render("login");
  });

  app.get("/login", (req, res) => {
    res.render("login");
  });

  app.get("/main", (req, res) => {
    res.render("main", { player: dataPlayer, games: dataGame });
  });

  app.post("/main", (req, res) => {
    if (req.body.psw !== "12345678")
      res.render("login", { error: "Wrong password! See README file." });
    dataPlayer = {
      username: req.body.uname,
      noWin: 0,
      noLose: 0,
      noTie: 0,
    };
    res.render("main", { player: dataPlayer, games: dataGame });
  });

  app.post("/delGame", async (req, res) => {
    var filtered = await dataGame.filter((element) => {
      return element.ID != req.body.ID;
    });

    console.log("ID:" + JSON.stringify(req.body));
    console.log("Filtered:" + JSON.stringify(filtered));

    dataGame = filtered;
    res.render("main", { player: dataPlayer, games: dataGame });
  });

  app.get("/logout", (req, res) => {
    dataPlayer = { username: "", noWin: 0, noLose: 0, noTie: 0 };
    res.render("login");
  });

  app.post("/createTictac", (req, res) => {
    // Pogledati da li postoji
    if (dataGame.find((x) => x.title === req.body.nameGame)) {
      res.render("main", { error: "Game already exist.", games: dataGame });
    }

    var idTemp = uuidv4();

    dataGame.unshift({
      ID: idTemp,
      title: req.body.nameGame,
      playersPlayed: [{ username: dataPlayer.username }],
    });

    // Ako ne postoji kreirati i ući u sobu
    res.render("main", {
      player: dataPlayer,
      games: dataGame,
    });
  });

  app.get("/tictac", (req, res) => {
    for (i = 0; i < dataGame.length; ++i) {
      console.log(JSON.stringify(dataGame));
      if (dataGame[i].ID == req.query.gid) {
        if (
          dataGame[i].playersPlayed.find(
            (x) => x.username == dataPlayer.username
          )
        ) {
          break;
        } else {
          dataGame[i].playersPlayed.unshift({ username: dataPlayer.username });
        }
      }
    }

    console.log(JSON.stringify(dataGame));
    console.log("gid " + req.query.gid);
    console.log("User " + dataPlayer.username);

    var gameInfo = dataGame.filter((x) => x.ID == req.query.gid);
    // Add name to current game
    var arrayOfPlayers = gameInfo.map((a) => a.playersPlayed);

    res.render("tictactoe", {
      player: dataPlayer,
      gameInfo: arrayOfPlayers,
    });
  });

  app.post("/tictac", (req, res) => {
    switch (req.body.result) {
      case "win":
        dataPlayer.noWin++;

        break;
      case "lose":
        dataPlayer.noLose++;

        break;
      case "tie":
        dataPlayer.noTie++;

        /*dataGame
          .find((x) => x.title === req.body.title)
          .playersPlayed.find((y) => y.username === dataPlayer.username)
          .noTie++;*/
        break;
      default:
    }
    console.log(JSON.stringify(req.body));
    res.render("tictactoe", { player: dataPlayer });
  });
};
