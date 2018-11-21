const data = require("./data.js");

/*
	Handles voice channel related processing
*/

var red = "\x1b[31m", bright = "\x1b[1m", reset = "\x1b[0m";

exports.isInGroupDMCall = function(msg) {
	console.log(bright + red + "%s" + reset + "%s\n", "Error: ", "isInGroupDMCall method not completed.");
	return false;
}

exports.isInGuildCall = function(msg) {
	console.log(bright + red + "%s" + reset + "%s\n", "Error: ", "isInGuildCall method not completed.");
	return false;
}

exports.checkGroupDMKeyword = function(msg) {
	var groupDMData = data.getGroupDMKeywords(msg.channel);
	for(var i in groupDMData) {
		if(msg.content === groupDMData[i]) return true;
	}
	return false;
}

exports.checkGuildKeyword = function(msg) {
	var guildData = data.getGuildKeywords(msg.guild);
	for(var i in guildData) {
		if(msg.content === guildData[i]) return true;
	}
	return false;
}

exports.playGroupDMKeyword = function(msg) {
	console.log(bright + red + "%s" + reset + "%s\n", "Error: ", "playGroupDMKeyword method not completed.");
	return;
}

exports.playGuildKeyword = function(msg) {
	console.log(bright + red + "%s" + reset + "%s\n", "Error: ", "playGuildKeyword method not completed.");
	return;
}


