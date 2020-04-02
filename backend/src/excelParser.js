const XLSX = require('xlsx')

let functions = {};

let player = function(name, picks) {
    this.name = name;
    this.picks = picks;
}

let pick = function(id, homePick) {
    this.id = id;
    this.homePick = homePick;
}

let players = [
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

bowlgameData = function (id, homeTeamLine, awayTeamLine) {
    this.id = id
    this.homeTeamLine = homeTeamLine;
    this.awayTeamLine = awayTeamLine;
}

getLine = function (file) {
    if (file.Line !== undefined) {
        return file.Line;
    } else {
        return 0;
    }
}

setPicksForGame = function(game, isHome) {
    for (let j = 0; j < players.length; j++) {
        if (game[players[j].name] == 'X'&& !players[j].picks.find(function(element) {
            if (element.id === game.id) {
                return true
            } else {
                return false
            }
        })) {
            if (isHome) {
                players[j].picks.push(new pick(game.id, true))
            } else {
                players[j].picks.push(new pick(game.id, false))
            }
        }
    }
}

functions.getPlayers = function () {
    // console.log("total players: " + players.length)
    // for (let i = 0; i < players.length; i++) {
    //     console.log("p"+(i+1)+": " + players[i].picks.length)
    // }
    // console.log("p1-pick2: "+players[0].picks[2].id)
    // console.log("p2-pick2: "+players[1].picks[2].id)
    return players;
}

functions.parseExcelFile = function(path) {
    function readExcelFile(path) {
        const workbook = XLSX.readFile(path);
        const sheet_name_list = workbook.SheetNames;
        return XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    }
    let file = readExcelFile(path)
    let bowlgames = [];
    let awayLine, homeLine = 0;
    for (let i = 0; i < file.length; i++) {
        if (file[i].venue === "Home") {
            homeLine = getLine(file[i])
            setPicksForGame(file[i], true)
        } else if (file[i].venue === "Away"){
            awayLine = getLine(file[i])
            setPicksForGame(file[i], false)
        }
        if (i%2 === 1) {
            bowlgames.push(new bowlgameData(file[i].id, homeLine, awayLine))
        }
    }
    return bowlgames;
}

module.exports = functions;
