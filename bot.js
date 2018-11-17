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
	if(channel instanceof Discord.groupDMChannel && data.hasGroupDMInfo(channel)) {
		data.deleteGroupDMFile(channel);
	}
})

client.on("message", msg => {

	// Group Chats outside of Guilds
	if(msg.channel instanceof Discord.GroupDMChannel) {
		
		if(!data.hasGroupDMInfo(msg.channel))
			data.makeGroupDMFile(msg.channel);

		// Handles playback of keyword-triggered audio clips in voice channels
		if(audio.isInGroupDMCall(msg) && audio.checkGroupDMKeyword(msg)) {
			msg.reply("Dannybot is currently unavailable.");
			//audio.playGroupDMKeyword(msg);
		}

		// Handles custom commands
		if (msg.content.length != 0 && msg.content[0] == '!')
			msg.reply("Dannybot is currently unavailable.");

	}

	// Guild Channel
	else if(msg.channel instanceof Discord.TextChannel) {

		// Handles playback of keyword-triggered audio clips in voice channels
		if(audio.isInGuildCall(msg) && audio.checkGuildKeyword(msg)) {
			msg.reply("Dannybot is currently unavailable.");
			//audio.playGuildKeyword(msg);
		}

		// Handles custom commands
		if (msg.content.length != 0 && msg.content[0] == '!')
			msg.reply("Dannybot is currently unavailable.");

		if(msg.content == "create")
			data.makeGuildFile(msg.guild);
		else if(msg.content == "delete") 
			data.deleteGuildFile(msg.guild);

	}

	// Direct Messages
	else { 

	}

});

client.login(config.token);