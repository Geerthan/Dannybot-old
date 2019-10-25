const Discord = require("discord.js");
const audio = require("./audio.js");
const data = require("./data.js");
//const fnIntegration = require("./fnIntegration.js");
const config = require("./config.json");

const client = new Discord.Client();

/*
	Main client setup and event handling (joining/leaving servers, messages)
*/

client.on('ready', () => {

	console.log("\n\x1b[32m%s\x1b[0m%s\n", "Logged in as: ", client.user.tag); 

	client.user.setPresence({ 
		game: { name: config.status }, 
		status: "online" })
	.catch(console.error);

});

client.on("guildCreate", guild => {
	data.makeGuildFile(guild);
});

client.on("guildDelete", guild => {
	data.deleteGuildFile(guild);
});

client.on("channelDelete", channel => {
	if(channel instanceof Discord.groupDMChannel && data.hasGroupDMFile(channel)) {
		data.deleteGroupDMFile(channel);
	}
})

client.on("message", msg => {

	// Group Chats outside of Guilds
	if(msg.channel instanceof Discord.GroupDMChannel) {
		
		if(!data.hasGroupDMFile(msg.channel))
			data.makeGroupDMFile(msg.channel);

		// Handles custom commands
		if (msg.content.length != 0 && msg.content[0] == '!')
			msg.reply("I am currently unavailable.");

	}

	// Guild Channel
	else if(msg.channel instanceof Discord.TextChannel) {

		if(!data.hasGuildFile(msg.guild))
			data.makeGuildFile(msg.guild);

		// Handles playback of keyword-triggered audio clips in voice channels
		if(audio.isInGuildCall(msg) && audio.checkGuildKeyword(msg) 
			&& !audio.botPlayingKeyword(msg, client.voiceConnections.values())) {

			msg.reply("I am currently unavailable.");
			audio.playGuildKeyword(msg);

		}

		// Handles custom commands
		if (msg.content.length != 0 && msg.content[0] == '!') {
			switch(msg.content.toLowerCase()) {
				case "!stop":
					if(!audio.isInGuildCall(msg))
						msg.reply("You must be in a call to use this command.");
					else audio.stopGuildAudio(msg, client.voiceConnections.values());
					break;

				case "!fn":


				default:
					msg.reply("Dannybot is currently unavailable.");
			}
		}

	}

	// Direct Messages
	else { 
		if(msg.author.id !== client.user.id && data.isGuildAdmin(msg.author.id)) {
			msgContent = msg.content.split(" ");
			switch(msgContent[0].toLowerCase()) {
				case "help":
					msg.reply("```\n" +
						"serverList: Provides a list of servers you have DannyBot access on.\n" +
						"servers: The same as serverList.\n" +
						"serverSelect [#]: Selects an active server to customize. Type servers to see which you can select.\n" + 
						"select [#]: The same as serverSelect.\n" +
						"audioList: Provides a list of audio files stored for the active server.\n" +
						"audio: The same as audioList.\n" +
						"addKeyword: not complete\n" + 
						"addKey: THe same as addKeyword.\n" +
						"```");
					break;
				case "serverlist":
				case "servers":
					var servers = data.getGuildAdminList(msg.author.id);
					var activeServer = data.getAdminActiveServer(msg.author.id);
					var output = "```\n";
					for(var i = 0;i < servers.length;i++) {
						output += i.toString() + ": " + data.getGuildName(servers[i]);
						if(i === activeServer) output += " | <-- Active server";
						output += "\n";
					}
					output += "```";
					msg.reply(output);
					break;
				case "select":
				case "serverselect":
					if(msgContent.length == 2 && !isNaN(parseInt(msgContent[1]))) {
						data.setAdminActiveServer(msg.author.id, parseInt(msgContent[1]));
						msg.reply("Active server set to " + data.getGuildName(data.getGuildAdminList(msg.author.id)[parseInt(msgContent[1])]) + '.');
					}
					else msg.reply("You need to specify the ID of the server you want to work with. Type help for details.");
					break;
				case "audiolist":
				case "audio":
					if(data.getAdminActiveServer(msg.author.id) === -1) {
						msg.reply("You need to specify the ID of the server you want to work with. Type help for details.");
						break;
					}
					var audioFiles = data.getGuildKeywordFiles(data.getGuildAdminList(msg.author.id)[data.getAdminActiveServer(msg.author.id)]);
					var output = "```\n";
					for(var i = 0;i < audioFiles.length;i++) {
						output += i.toString() + ": " + audioFiles[i] + "\n";
					}
					if(audioFiles.length === 0) output += "There are no audio files for this server.\n";
					output += "```";
					msg.reply(output);
					break;
				case "addKeyword":
				case "addKey":

					break;
				default:
					msg.reply("Command not recognized. Type help for a list of commands to use.");
			}
		}
		else if(msg.author.id !== client.user.id) {
			msg.reply("You do not have access to Dannybot's DM functions.\nPlease talk to a server administrator.");
		}
	}

});

client.login(config.token);