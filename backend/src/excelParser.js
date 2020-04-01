const XLSX = require('xlsx')
const gd = require("./gameData")

let functions = {};

let player = function(name, picks) {
    this.name = name;
    this.picks = picks;
}

let pick = function(bowlID, homePick) {
    this.bowlID = bowlID;
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

bowlgameData = function (bowlId, homeTeamLine, awayTeamLine) {
    this.bowlId = bowlId
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

setPicksForGame = function(file, isHome) {
    for (let j = 0; j < players.length; j++) {
        if (file[players[j].name] == 'X'&& !players[j].picks.find(function(element) {
            if (element.bowlID === file.id) {
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

functions.getPlayers = function () {
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
    let awayLine, homeLine;

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
