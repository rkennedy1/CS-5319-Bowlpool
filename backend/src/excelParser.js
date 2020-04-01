const XLSX = require('xlsx')
const gd = require("gameData")

var exports = {};
exports.bowlgameData = function(bowlId, homeTeamLine, awayTeamLine) {
    this.bowlId = bowlId
    this.homeTeamLine = homeTeamLine;
    this.awayTeamLine = awayTeamLine;
}

exports.readExcelFile = function(path) {
    const workbook = XLSX.readFile(path);
    const sheet_name_list = workbook.SheetNames;
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
}

exports.parseExcelFile = function(path) {
    var file = readExcelFile(path)
    var bowlgames = [];
    var awayLine, homeLine;

    for(var i = 0; i < file.length; i++) {
        if (file[i].venue == "Home") {
            homeLine = gd.getLine(file[i])
            gd.setPicksForGame(file[i], true)
        } else {
            awayLine = gd.getLine(file[i])
            gd.setPicksForGame(file[i], false)
        }
        if (i%2 == 1) {
            bowlgames.push(new bowlgameData(file[i].id, homeLine, awayLine))
        }
    }
    return bowlgames;
}

module.exports = exports
