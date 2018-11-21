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
	for(var i of msg.guild.channels) {
		if(i[1].type === "voice") {
			for(var j of i[1].members) {
				if(msg.author.id === j[0])
					return true;
			}
		} 
	}
	return false;
}

exports.checkGroupDMKeyword = function(msg) {
	var groupDMData = data.getGroupDMKeywords(msg.channel);
	var lowerCaseContent = msg.content.toLowerCase();
	for(var i in groupDMData) {
		if(msg.content === groupDMData[i].toLowerCase()) return true;
	}
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

exports.playGroupDMKeyword = function(msg) {
	console.log(bright + red + "%s" + reset + "%s\n", "Error: ", "playGroupDMKeyword method not completed.");
	return;
}

exports.playGuildKeyword = function(msg) {
	console.log(bright + red + "%s" + reset + "%s\n", "Error: ", "playGuildKeyword method not completed.");
	return;
}


