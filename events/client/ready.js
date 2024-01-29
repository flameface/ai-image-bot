const { ActivityType } = require("discord.js");
const { logger } = require("../../configuration/common.js");
const client = require("../../index");

module.exports = {
  name: "ready",
  once: true,

  /**
   * @param {Client} client
   * @returns;
   *
   */

  callback: async () => {
    console.log("\n")
    logger("INFO", "Client", `${client.user.tag} Is Online!`)

    let i = 0;
    let statuses = ["Images"];


    setInterval(() => {
      let status = statuses[i];
      client.user.setActivity({ name: status, type: ActivityType.Playing });
      i = (i + 1) % statuses.length;
    }, 5000);
  }
}