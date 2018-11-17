const Discord = require("discord.js");
const audio = require("./audio.js");
const data = require("./data.js");
const config = require("./config.json");

const client = new Discord.Client();

client.on('ready', () => {

	console.log('\n%s\x1b[32m%s\x1b[0m\n', 'Logged in as: ', client.user.tag); 

	client.user.setPresence({ 
		game: { name: config.status }, 
		status: "online" })
	.then(console.log)
	.catch(console.error);

});

client.on('guildCreate', guild => {
	data.makeGuildFile(guild);
});

client.on('guildDelete', guild => {
	data.deleteGuildFile(guild);
});

client.on('message', msg => {

	// Group Chats outside of Guilds
	if(msg.channel instanceof Discord.GroupDMChannel) {
		
	}

	// Guild Channel
	else if(msg.channel instanceof Discord.TextChannel) {

		// Handles playback of keyword-triggered audio clips in voice channels
		if(audio.isInCall(msg) && audio.checkKeyword(msg))
			audio.playKeyword(msg);

		if (msg.content.length != 0 && msg.content[0] == '!')
			msg.reply('Dannybot is currently unavailable.');

		}

	// Direct Messages
	else { 

	}

});

client.login(config.token);