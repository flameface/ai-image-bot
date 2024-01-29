const { ChatInputCommandInteraction, ApplicationCommandType } = require("discord.js");

const data = {
  type: ApplicationCommandType.ChatInput,
  name: "ping",
  description: "display current ping dada.",
}

const perms = {
  BotPermissions: ["SendMessages"], UserPermissions: ["SendMessages"], devOnly: false
}

/** 
 * @param {ChatInputCommandInteraction}interaction;
 * @param {Client} client;
 * @returns;
 */

async function callback(client, interaction) {
  return interaction.reply({ ephemeral: true, content: `${client.ws.ping}ms` });
}


module.exports = { data, perms, callback }