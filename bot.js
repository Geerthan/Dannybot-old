const Discord = require("discord.js");
const audio = require("./audio.js");
const data = require("./data.js");
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
			msg.reply("Dannybot is currently unavailable.");

	}

	// Guild Channel
	else if(msg.channel instanceof Discord.TextChannel) {

		if(!data.hasGuildFile(msg.guild))
			data.makeGuildFile(msg.guild);

		// Handles playback of keyword-triggered audio clips in voice channels
		if(audio.isInGuildCall(msg) && audio.checkGuildKeyword(msg) 
			&& !audio.botPlayingKeyword(msg, client.voiceConnections.values())) {

			msg.reply("Dannybot is currently unavailable.");
			audio.playGuildKeyword(msg);

		}

		// Handles custom commands
		if (msg.content.length != 0 && msg.content[0] == '!') {
			switch(msg.content) {
				case "!stop":
					if(!audio.isInGuildCall(msg))
						msg.reply("You must be in a call to use this command.");
					else audio.stopGuildAudio(msg, client.voiceConnections.values());
					break;

				default:
					msg.reply("Dannybot is currently unavailable.");
			}
		}

	}

	// Direct Messages
	else { 
		if(msg.author.id !== client.user.id && data.isGuildAdmin(msg.author.id)) {
			msg.reply("The admin panel is currently unavailable.");
		}
		else if(msg.author.id !== client.user.id) {
			msg.reply("You do not have access to Dannybot's DM functions.\nPlease talk to a server administrator.");
		}
	}

});

client.login(config.token);