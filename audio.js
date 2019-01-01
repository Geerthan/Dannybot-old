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
	var guildData = data.getGuildKeywords(msg.guild);
	var lowerCaseContent = msg.content.toLowerCase();
	var randN = Math.random();
	var fileChances;

	for(var i in guildData) {
		if(msg.content === guildData[i].toLowerCase()) {
			fileChances = data.getGuildFileChances(msg.guild)[i];
			break;
		}
	}

	var chosenFileIdx = 0;
	var overallChance = 0;
	for(var j = 1;j < fileChances.length;j++) {
		overallChance += fileChances[j-1][1];
		if(overallChance > randN)
			chosenFileIdx = j;
	}

	var chosenFile = data.getGuildKeywordFiles(msg.guild)[chosenFileIdx];
	console.log(chosenFile);

	msg.member.voiceChannel.join()
		.then(connection => {

			dispatcher = connection.playFile("music/" + chosenFile);
			dispatcher.on("end", () => {
				connection.disconnect();
			})

		});

	return;
}

exports.botPlayingKeyword = function(msg, voiceConnections) {
	for(var connection of voiceConnections) {
		if(msg.member.voiceChannel.guild === connection.channel.guild)
			return true;
	}
	return false;
}

exports.stopGuildAudio = function(msg, voiceConnections) {
	for(var connection of voiceConnections) {
		if(msg.member.voiceChannel === connection.channel)
			connection.dispatcher.end();
	}
}