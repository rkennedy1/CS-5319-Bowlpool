/**A simple node/express server that include communication with a
 * mysql db instance.
*/

//create main objects

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
const axios = require("axios");
const https = require('https');
const fetch = require("node-fetch");
const XLSX = require('xlsx');

var bowlgameData = function(bowlId, homeTeamLine, awayTeamLine) {
  this.bowlId = bowlId
  this.homeTeamLine = homeTeamLine;
  this.awayTeamLine = awayTeamLine;
}

var bowlGame = function(bowlID, date, homeTeam, awayTeam, homeTeamLine, awayTeamLine, homeScore, awayScore) {
    this.bowlID = bowlID;
    this.date = date;
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    this.homeTeamLine = homeTeamLine;
    this.awayTeamLine = awayTeamLine;
    this.homeScore = homeScore;
    this.awayScore = awayScore;
};

var player = function(name, picks) {
  this.name = name;
  this.picks = picks;
}

var pick = function(bowlID, homePick) {
  this.bowlID = bowlID;
  this.homePick = homePick;
}

var bowlData = function(bowlGames, players) {
  this.bowlGames = bowlGames;
  this.players = players;
}

//set up some configs for express.
const config = {
  name: 'sample-express-app',
  port: 3000,
  host: '0.0.0.0',
};

//create the express.js object
const app = express();

//create a logger object.  Using logger is preferable to simply writing to the console.
const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(cors());
app.use(ExpressAPILogMiddleware(logger, { request: true }));

var players = [
  new player("AJK", []),
	new player("MAK", []),
	new player("HR", []),
	new player("JMK", []),
  new player("SRK", []),
  new player("CRK", []),
  new player("HMR", []),
  new player("MSK", []),
  new player("JY", []),
  new player("NDK", []),
  new player("SMJ", []),
  new player("RYAN", []),
  new player("CDB", []),
  new player("KGK", [])
]

const getGameDataForID = async (gameID, homeLine, awayLine) => {
    var url = "https://api.collegefootballdata.com/games?year=2019&seasonType=regular&id=";
    const response = await fetch(url + gameID)
    const myJSON = await response.json();
    return await new bowlGame(myJSON[0].id, myJSON[0].start_date, myJSON[0].home_team, myJSON[0].away_team, homeLine, awayLine, myJSON[0].home_points, myJSON[0].away_points)
}

const getGameData = async  () => {
  var url = "https://api.collegefootballdata.com/games?year=2019&seasonType=postseason"
  const response = await fetch(url)
  const myJSON = await response.json();
  return await myJSON;
}

function readExcelFile(path) {
  const workbook = XLSX.readFile(path);
  const sheet_name_list = workbook.SheetNames;
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
}


/*
&& !players[j].picks.find(function(element) {
  if (element == file[i].id) {
    return true
  } else {
    return false
  }
})
*/

function getLine(file) {
  if (file.Line) {
    return file.Line;
  } else {
    return 0;
  }
}

function setPicksForGame(file, isHome) {
  console.log(file.id);
  for (var j = 0; j < players.length; j++) {
    if (file[players[j].name] == 'X'&& !players[j].picks.find(function(element) {
      if (element.bowlID == file.id) {
        return true
      } else {
        return false
      }
    })) {
      if (isHome) {
        players[j].picks.push(new pick(file.id, true))
      } else {

        players[j].picks.push(new pick(file.id, false))
      }
    }
  }
}

function parseExcelFile (file) {
  //console.log(file);
  var bowlgames = [];
  var awayLine, homeLine;

  for(var i = 0; i < file.length; i++) {
    if (file[i].venue == "Home") {
      homeLine = getLine(file[i])
      setPicksForGame(file[i], true)
    } else {
      awayLine = getLine(file[i])
      setPicksForGame(file[i], false)
    }
    if (i%2 == 1) {
      bowlgames.push(new bowlgameData(file[i].id, homeLine, awayLine))
    }
  }
  return bowlgames;
}

const createGameData = async () => {
  var bowlGames = [];
  console.log("data");
  let gameDataJSON = await getGameData().then((result) => {
    for (var i = 0; i < result.length; i++) {
      bowlGames.push(new bowlGame(result[i].id, result[i].start_date, result[i].home_team, result[i].away_team, games[i].homeTeamLine, games[i].awayTeamLine, result[i].home_points, result[i].away_points))
    }
  });
  /*
  for(var i = 0; i < games.length; i++) {
    const gameData = await getGameDataForID(games[i].bowlId, games[i].homeTeamLine, games[i].awayTeamLine)
    bowlGames.push(gameData)
  }
  */
  return await Promise.all(bowlGames);
}

let games = parseExcelFile(readExcelFile('resources/bowlpool.xlsx'))
var currentGameData = [];
let gameData = createGameData().then((result) => {
  console.log(result);
  currentGameData = result;
})

app.get('/', (req, res) => {
  let gameData = createGameData().then((result) => {
    currentGameData = result;
    res.send(new bowlData(currentGameData, players))
  })
});


//connecting the express object to listen on a particular port as defined in the config object.
app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
  logger.info(`${config.name} running on ${config.host}:${config.port}`);
});
