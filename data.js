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
	console.log(bright + blue + "%s" + reset + "%s%s%s\n", "Data: ", "Created group dm file with id ", groupDM.id, ".");
}

exports.makeGuildFile = function(guild) {
	fs.copyFileSync("templateGuildFile.json", "servers/guild" + guild.id + ".json");

	server_data.guildNames[guild.id] = guild.name;

	for(var i of guild.members.values()) {

		if(i.hasPermission("ADMINISTRATOR")) {
			var userExists = false;
			for(var j in server_data.adminData) {
				if(server_data.adminData[j].userID === i.user.id) {
					userExists = true;
					server_data.adminData[j].guildIDs.push(guild.id);
					break;
				}
			}

			if(!userExists)
				server_data.adminData.push({ "userID": i.user.id, "guildIDs": [guild.id], "activeServer": -1 });
		}

	}

	fs.writeFile("server_data.json", JSON.stringify(server_data, null, 2), function(err) {
		if(err) return console.log(err);
	});

	console.log(bright + blue + "%s" + reset + "%s%s%s\n", "Data: ", "Created guild file with id ", guild.id, ".");
}

exports.deleteGroupDMFile = function(groupDM) {
	fs.unlinkSync("servers/groupDM" + groupDM.id + ".json");
	console.log(bright + blue + "%s" + reset + "%s%s%s\n", "Data: ", "Deleted group dm file with id ", groupDM.id, ".");
}

exports.deleteGuildFile = function(guild) {
	fs.unlinkSync("servers/guild" + guild.id + ".json");

	delete server_data.guildNames[guild.id]; //Implement using a more efficient solution

	for(var i = 0;i < server_data.adminData.length;i++) {
		if(server_data.adminData[i].guildIDs.includes(guild.id)) {
			server_data.adminData[i].guildIDs.splice(server_data.adminData[i].guildIDs.indexOf(guild.id), 1);
			server_data.adminData[i].activeServer = -1;
			if(server_data.adminData[i].guildIDs.length === 0) {
				server_data.adminData.splice(i, 1);
				i--;
			}
		}
	}

	fs.writeFile("server_data.json", JSON.stringify(server_data, null, 2), function(err) {
		if(err) return console.log(err);
	});


	console.log(bright + blue + "%s" + reset + "%s%s%s\n", "Data: ", "Deleted guild file with id ", guild.id, ".");
}

exports.hasGroupDMFile = function(groupDM) {
	return fs.existsSync("servers/groupDM" + groupDM.id + ".json");
}

exports.hasGuildFile = function(guild) {
	return fs.existsSync("servers/guild" + guild.id + ".json");
}

exports.getGuildKeywords = function(guildID) {
	return getGuildData(guildID).keywords.keys;
}

exports.getGuildFileChances = function(guildID) {
	return getGuildData(guildID).keywords.fileChances;
}

exports.getGuildKeywordFiles = function(guildID) {
	return getGuildData(guildID).keywords.files;
}

exports.isGuildAdmin = function(id) {
	for(var adminData of server_data.adminData)
		if(adminData.userID === id) return true;
	return false;
}

exports.getGuildAdminList = function(id) {
	for(var adminData of server_data.adminData)
		if(adminData.userID === id) return adminData.guildIDs;
}

exports.getAdminActiveServer = function(id) {
	for(var adminData of server_data.adminData)
		if(adminData.userID === id) return adminData.activeServer;
}

exports.setAdminActiveServer = function(id, server) {
	for(var adminData of server_data.adminData)
		if(adminData.userID === id) {
			adminData.activeServer = server;
			break;
		}
	fs.writeFile("server_data.json", JSON.stringify(server_data, null, 2), function(err) {
		if(err) return console.log(err);
	});
}

exports.getGuildName = function(guildID) {
	return server_data.guildNames[guildID];
}

var getGroupDMData = function(groupDM) {
	return JSON.parse(fs.readFileSync("servers/groupDM" + groupDM.id + ".json"));
}

var getGuildData = function(guildID) {
	return JSON.parse(fs.readFileSync("servers/guild" + guildID + ".json"));
}