var player = function(name, picks) {
    this.name = name;
    this.picks = picks;
}

var pick = function(bowlID, homePick) {
    this.bowlID = bowlID;
    this.homePick = homePick;
}

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

export function getLine(file) {
    if (file.Line) {
        return file.Line;
    } else {
        return 0;
    }
}

export const createGameData = async () => {
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

const getGameDataForID = async (gameID, homeLine, awayLine) => {
    var url = "https://api.collegefootballdata.com/games?year=2019&seasonType=regular&id=";
    const response = await fetch(url + gameID)
    const myJSON = await response.json();
    return await new bowlGame(myJSON[0].id, myJSON[0].start_date, myJSON[0].home_team, myJSON[0].away_team, homeLine, awayLine, myJSON[0].home_points, myJSON[0].away_points)
}

export const getGameData = async  () => {
    var url = "https://api.collegefootballdata.com/games?year=2019&seasonType=postseason"
    const response = await fetch(url)
    const myJSON = await response.json();
    return await myJSON;
}

export function setPicksForGame(file, isHome) {
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