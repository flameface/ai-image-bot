const { Message, Client } = require("discord.js");

const data = {
  name: "ping",
  aliases: ["ms", "ws"],
}

const perms = {
  BotPermissions: ["SendMessages"], UserPermissions: ["SendMessages"], devOnly: false
}

/**
 * @param {Client} client;
 * @param {Message} message;
 * @param {*} args;
 * @returns;
 * 
 */

async function callback(client, message, args) {
  return message.reply({ content: `Ping: ${client.ws.ping}ms` });
}

module.exports = { data, perms, callback }