const fetch = require("node-fetch");
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

functions.createGameData = async () => {
    let bowlGames = [];
    let games = ep.parseExcelFile('resources/bowlpool.xlsx')
    let gameDataJSON = await getGameData().then((result) => {
        result.pop(); //Removes Championship game from api data since the game is not on excel sheet
        for (let i = 0; i < (result.length && games.length); i++) {
            //console.log(games[i].id + " g:r " + result[i].id)
            //console.log(result[i].homeTeamLine + " " + result[i].awayTeamLine)
            bowlGames.push(new bowlGame(result[i].id, result[i].start_date, result[i].home_team, result[i].away_team, games[i].homeTeamLine, games[i].awayTeamLine, result[i].home_points, result[i].away_points))
        }
    }).catch((error) => {
        console.error(error)
    });
    /*
    for(var i = 0; i < games.length; i++) {
      const gameData = await getGameDataForID(games[i].bowlId, games[i].homeTeamLine, games[i].awayTeamLine)
      bowlGames.push(gameData)
    }
    */
    return await Promise.all(bowlGames);
}

functions.getPlayers = function () {
    return ep.getPlayers()
}

/*getGameDataForID = async (gameID, homeLine, awayLine) => {
    let url = "https://api.collegefootballdata.com/games?year=2019&seasonType=regular&id=";
    const response = await fetch(url + gameID)
    const myJSON = await response.json();
    return await new bowlGame(myJSON[0].id, myJSON[0].start_date, myJSON[0].home_team, myJSON[0].away_team, homeLine, awayLine, myJSON[0].home_points, myJSON[0].away_points)
}*/

getGameData = async  () => {
    let url = "https://api.collegefootballdata.com/games?year=2019&seasonType=postseason"
    const response = await fetch(url)
    const myJSON = await response.json();
    return await myJSON;
}

module.exports = functions;