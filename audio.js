const data = require("./data.js");

/*
	Handles voice channel related processing
*/

var red = "\x1b[31m", bright = "\x1b[1m", reset = "\x1b[0m";

exports.isInGuildCall = function(msg) {
	if(msg.member.voiceChannel) return true;
	return false;
}

exports.checkGuildKeyword = function(msg) {
	var guildData = data.getGuildKeywords(msg.guild);
	var lowerCaseContent = msg.content.toLowerCase();
	for(var i in guildData) {
		if(msg.content === guildData[i].toLowerCase()) return true;
	}
	return false;
}

exports.playGuildKeyword = function(msg) {
	console.log(bright + red + "%s" + reset + "%s\n", "Error: ", "playGuildKeyword method not completed.");
	return;
}


