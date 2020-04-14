const express = require('express');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
const gd = require("../model/gameData.js")
const cors = require('cors');


const config = {
  name: 'sample-express-view',
  port: 3000,
  host: '0.0.0.0',
};

const app = express();
app.use(cors());


const logger = log({ console: true, file: false, label: config.name });

let currentGameData = [];
let bowlData = function(bowlGames, players) {
  this.bowlGames = bowlGames;
  this.players = players;
}

let gameData = gd.createGameData().then((result) => {
  currentGameData = result;
})


app.get('/', (req, res) => {
  res.send(new bowlData(currentGameData, gd.getPlayers(currentGameData)))
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
