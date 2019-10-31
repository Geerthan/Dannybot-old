const data = require("./data.js");
const util = require("util");
const Fortnite = require("fortnite");

const fnClient = new Fortnite('your-token-here');

const setTimeoutPromise = util.promisify(setTimeout);

exports.showStats = async function(msg) {

	var delay = function(t) {
		return new Promise((resolve, reject) => {
			setTimeout(function() {
				resolve();
			}, t);
		});
	}

	var getStatusMsg = function(playersLogged, percentDone) {
		return "Logging users..." + playersLogged + '/' + playerList.length + '\n' + 
					'[' + '█'.repeat(Math.trunc(percentDone*15)) + '░'.repeat(Math.ceil(15-(percentDone*15))) + ']';
	}

	var playersLogged = 0;
	var playerList = data.getGuildFNPlayers(msg.guild.id);
	var statsList = [];
	var percentDone = 0.5/playerList.length;

	var outputMsg = msg.channel.send(getStatusMsg(playersLogged, percentDone));

	for(i = 0;i < playerList.length;i++) {

		if(i != 0) {
			await delay(1000);

			percentDone = (playersLogged+0.5)/playerList.length;

			outputMsg.then(function(msg) {
				msg.edit(getStatusMsg(playersLogged, percentDone));
			});

			await delay(1000);
		}

		var rawData = await fnClient.user(playerList[i].name, playerList[i].platform);

		if(!("stats" in rawData)) {
			outputMsg.then(function(msg) {
				msg.reply("An error occurred on user: " + playerList[i] + "\n" + 
					"Error: " + rawData.error + '.');
			});
			return;
		}

		statsList.push({
			"name": playerList[i].name,
			"wins": rawData.stats.lifetime.wins,
			"kd": rawData.stats.lifetime.kd,
			"kills": rawData.stats.lifetime.kills
		});

		playersLogged++;

		percentDone = playersLogged/playerList.length;

		if(i != playerList.length-1) {
			outputMsg.then(function(msg) {
				msg.edit(getStatusMsg(playersLogged, percentDone));
			});
		}

	}

	outputMsg.then(function(msg) {
		msg.edit("All users logged\n [███████████████]");
	});

	var outputStr = "";
	for(stat in statsList) {
		outputStr += statsList[stat].name + " - Wins: " + statsList[stat].wins + ", K/D: " + statsList[stat].kd + ", Kills: " + statsList[stat].kills;
		if(stat != statsList[stat.length-1]) outputStr += "\n";
	}

	outputMsg.then(function(msg) {
		msg.edit(outputStr);
	})

}