const client = require("../../Client");

client.on("ready", async () => {
    console.log(`\n🟩 ${client.user.tag} is online!`);
})