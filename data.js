const fs = require("fs");
const server_data = require("./server_data.json");

/*
	Handles file input/output for storage of server and user information
*/

var templateGuildFile = "templateGuildFile.json";
var templateGroupDMFile = "templateGroupDMFile.json";

var red = "\x1b[31m", blue = "\x1b[34m", bright = "\x1b[1m", reset = "\x1b[0m";

exports.makeGroupDMFile = function(groupDM) {
	fs.copyFile("templateGroupDMFile.json", "servers/groupDM" + groupDM.id + ".json");
	server_data.dmChannelIDs.push(groupDM.id);
	// Add server_data.adminData

	console.log(bright + blue + "%s" + reset + "%s%s%s\n", "Data: ", "New group dm file with id ", groupDM.id, " created.");
}

exports.makeGuildFile = function(guild) {
	fs.copyFile("templateGuildFile.json", "servers/guild" + guild.id + ".json");
	server_data.guildIDs.push(guild.id);
	// Add server_data.adminData

	console.log(bright + blue + "%s" + reset + "%s%s%s\n", "Data: ", "New guild file with id ", guild.id, " created.");
}

exports.deleteGroupDMFile = function(groupDM) {
	fs.unlink("servers/groupDM" + groupDM.id + ".json");
	console.log(bright + blue + "%s" + reset + "%s%s%s\n", "Data: ", "Deleted group dm file with id ", groupDM.id, ".");
}

exports.deleteGuildFile = function(guild) {
	fs.unlink("servers/guild" + guild.id + ".json");
	console.log(bright + blue + "%s" + reset + "%s%s%s\n", "Data: ", "Deleted guild file with id ", guild.id, ".");
}

exports.hasGroupDMInfo = function(groupDM) {
	console.log(bright + red + "%s" + reset + "%s\n", "Error: ", "hasGroupDMInfo method not completed.");
}

exports.getGroupDMKeywords = function(groupDM) {
	return getGroupDMData(groupDM).keywords.keys;
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