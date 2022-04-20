
const fetch = require('node-fetch')
const ep = require("./excelParser.js")

let functions = {};

let bowlGame = function(bowlID, date, homeTeam, awayTeam, homeTeamLine, awayTeamLine, homeScore, awayScore) {
    this.bowlID = bowlID;
    this.date = date;
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    this.homeTeamLine = homeTeamLine;
    this.awayTeamLine = awayTeamLine;
    this.homeScore = homeScore;
    this.awayScore = awayScore;
}

let checkIfHomeWon = function(home, away, hLine, aLine) {
    if (home !== 0 && away !== 0) {
        return (home+parseFloat(hLine)) > (away+parseFloat(aLine))
    } else{
        return false
    }
}

functions.createGameData = async () => {
    let bowlGames = [];
    let games = ep.parseExcelFile('resources/bowlpool.xlsx')
    let gameDataJSON = await getGameData().then((result) => {
        result.pop(); //Removes Championship game from controller data since the game is not on excel sheet
        for (let i = 0; i < (result.length && games.length); i++) {
            bowlGames.push(new bowlGame(result[i].id, result[i].start_date, result[i].home_team, result[i].away_team, games[i].homeTeamLine, games[i].awayTeamLine, result[i].home_points, result[i].away_points))
        }
    }).catch((error) => {
        console.error(error)
    });
    return await Promise.all(bowlGames);
}

let setScores  = function(players, games) {
    for (let i = 0; i < players.length; i++) {
        players[i].points = 0
    }
    for (let i = 0; i < games.length; i++) {
        for (let j = 0; j < players.length; j++) {
            if (checkIfHomeWon(games[i].homeScore, games[i].awayScore, games[i].homeTeamLine, games[i].awayTeamLine)) {
                if (players[j].picks[i].homePick)
                    players[j].points++
            } else {
                if (!players[j].picks[i].homePick)
                    players[j].points++
            }
        }
    }
    return players
}

functions.getPlayers = function (data) {

    return setScores(ep.getPlayers(), data)
}

getGameData = async  () => {
    let url = "https://api.collegefootballdata.com/games?year=2019&seasonType=postseason"
    const response = await fetch(url, {
      method: 'get',
      headers: {
        'Authorization': `Bearer 1/L/DhvSi4BuxRMHMvpFCMl0MEZhjUYC14MaGwsYa4pgps8Y/cSi5zTlTry5KSPN`
      },
    })
    const myJSON = await response.json();
    return await myJSON;
}

module.exports = functions;
