const Discord = require("discord.js");
const config = require("./config.json");
const audio = require("./audio.js");

const client = new Discord.Client();

client.on('ready', () => {

	console.log('\n%s\x1b[32m%s\x1b[0m\n', 'Logged in as: ', client.user.tag); 

	client.user.setPresence({ 
		game: { name: config.status }, 
		status: "online" })
	.then(console.log)
	.catch(console.error);

});

client.on('message', msg => {

	//Handles playback of keyword-triggered audio clips in voice channels
	if(audio.isInCall(msg) && audio.checkKeyword(msg.content))
		audio.playKeyword(msg);

	if (msg.content.length != 0 && msg.content[0] == '!')
		msg.reply('Dannybot is currently unavailable.');

});

client.login(config.token);