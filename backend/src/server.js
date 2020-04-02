const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
const gd = require("./gameData.js")

const config = {
  name: 'sample-express-app',
  port: 3000,
  host: '0.0.0.0',
};

const app = express();

const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(cors());
app.use(ExpressAPILogMiddleware(logger, { request: true }));

let currentGameData = [];
let bowlData = function(bowlGames, players) {
  this.bowlGames = bowlGames;
  this.players = players;
}

let gameData = gd.createGameData().then((result) => {
  currentGameData = result;
})

app.get('/', (req, res) => {
  res.send(new bowlData(currentGameData, gd.getPlayers()))
  /*let gameData = gd.createGameData().then((result) => {
    currentGameData = result;
    res.send(new bowlData(currentGameData, gd.getPlayers()))
  })*/
});


//connecting the express object to listen on a particular port as defined in the config object.
app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
  logger.info(`${config.name} running on ${config.host}:${config.port}`);
});
