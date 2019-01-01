const fs = require("fs");
const server_data = require("./server_data.json");

/*
	Handles file input/output for storage of server and user information
*/

var templateGuildFile = "templateGuildFile.json";
var templateGroupDMFile = "templateGroupDMFile.json";

var red = "\x1b[31m", blue = "\x1b[34m", bright = "\x1b[1m", reset = "\x1b[0m";

exports.makeGroupDMFile = function(groupDM) {
	fs.copyFileSync("templateGroupDMFile.json", "servers/groupDM" + groupDM.id + ".json");
	server_data.dmChannelIDs.push(groupDM.id);
	// Add server_data.adminData

	console.log(bright + blue + "%s" + reset + "%s%s%s\n", "Data: ", "Created group dm file with id ", groupDM.id, ".");
}

exports.makeGuildFile = function(guild) {
	fs.copyFileSync("templateGuildFile.json", "servers/guild" + guild.id + ".json");
	server_data.guildIDs.push(guild.id);
	// Add server_data.adminData

	console.log(bright + blue + "%s" + reset + "%s%s%s\n", "Data: ", "Created guild file with id ", guild.id, ".");
}

exports.deleteGroupDMFile = function(groupDM) {
	fs.unlinkSync("servers/groupDM" + groupDM.id + ".json");
	console.log(bright + blue + "%s" + reset + "%s%s%s\n", "Data: ", "Deleted group dm file with id ", groupDM.id, ".");
}

exports.deleteGuildFile = function(guild) {
	fs.unlinkSync("servers/guild" + guild.id + ".json");
	console.log(bright + blue + "%s" + reset + "%s%s%s\n", "Data: ", "Deleted guild file with id ", guild.id, ".");
}

exports.hasGroupDMFile = function(groupDM) {
	return fs.existsSync("servers/groupDM" + groupDM.id + ".json");
}

exports.hasGuildFile = function(guild) {
	return fs.existsSync("servers/guild" + guild.id + ".json");
}

exports.getGuildKeywords = function(guild) {
	return getGuildData(guild).keywords.keys;
}

var getGroupDMData = function(groupDM) {
	return JSON.parse(fs.readFileSync("servers/groupDM" + groupDM.id + ".json"));
}

var getGuildData = function(guild) {
	return JSON.parse(fs.readFileSync("servers/guild" + guild.id + ".json"));
}