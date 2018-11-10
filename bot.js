
const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();

client.on('ready', () => {
	console.log('\n%s\x1b[32m%s\x1b[0m\n', 'Logged in as ', client.user.tag); 
});

client.on('message', msg => {

	if (msg.content.length != 0 && msg.content[0] == '!')
		msg.reply('Dannybot is currently unavailable.');

});

client.login(config.token);
