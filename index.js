const { Client, Partials, Collection, REST, Routes, ApplicationCommandType } = require("discord.js");
const { ClientToken, ClientID } = require("./configuration/config.json");
const { logger } = require("./configuration/common.js");
const { readdirSync } = require("fs");

const client = new Client({
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildMessages",
    "MessageContent",
    "GuildPresences",
    "GuildVoiceStates",
    "DirectMessages",
  ],
  partials: [
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
    Partials.GuildMember,
    Partials.Message,
  ]
});

client.commands = new Collection();
client.slashCommands = new Collection();

//stores models list rather than fetching everytime.
client.models = new Collection();

module.exports = client;

(async () => {
  await loadCommands();
  await loadEvents();
  await loadSlashCommands();
})();

process.on("unhandledRejection", (reason, p) => {
  console.log(reason, p)
});

process.on("uncaughtException", (err, origin) => {
  console.log(err, origin)
});

client.login(ClientToken).catch((err) => {
  logger("WARN", "Client", `${err}`);
});

async function loadEvents() {
  console.log(`\n✎ ᴇᴠᴇɴᴛ-ʟᴏᴀᴅᴇʀ-ʀᴜɴɪɴɢ...`);

  readdirSync("./events/").forEach(async (directory) => {
    const events = readdirSync(`./events/${directory}`).filter((file) => file.endsWith(".js"));

    events.forEach(file => {
      const event = require(`./events/${directory}/${file}`);

      if (event.once) {
        client.once(event.name, async (...args) => {
          event.callback(...args)
        })
      } else {
        client.on(event.name, async (...args) => {
          event.callback(...args)
        })
      }

      logger("INFO", event.name, "Successfully Loaded.");
    })
  })
}

async function loadCommands() {
  console.log(`\n✎ ᴍᴇssᴀɢᴇ-ᴄᴏᴍᴍᴀɴᴅ-ʟᴏᴀᴅᴇʀ-ʀᴜɴɪɴɢ...`);

  readdirSync("./commands/").forEach(async (directory) => {
    const commands = readdirSync(`./commands/${directory}`).filter((file) => file.endsWith(".js"));

    commands.forEach((file) => {
      const command = require(`./commands/${directory}/${file}`);

      if (!command.data.name) return logger("WARN", file, `Missing command name.`);

      client.commands.set(command.data.name, command);

      logger("INFO", command.data.name, "Successfully Loaded.");
    })
  })
}

async function loadSlashCommands() {
  console.log(`\n✎ sʟᴀsʜ-ᴄᴏᴍᴍᴀɴᴅ-ʟᴏᴀᴅᴇʀ-ʀᴜɴɪɴɢ...`);

  if (!ClientID) {
    return logger("WARN", "Client", `Client ID is missing in config file.`);
  }

  const slashArray = [];
  readdirSync("./slashcommands/").forEach(async (directory) => {
    const slashCommands = readdirSync(`./slashcommands/${directory}`).filter((file) => file.endsWith(".js"));

    slashCommands.forEach(async (file) => {
      const slash = require(`./slashcommands/${directory}/${file}`);

      if (!slash.data.name) return logger("WARN", file, `Missing command name.`);

      client.slashCommands.set(slash.data.name, slash);

      slashArray.push(slash.data);

      logger("INFO", slash.data.name, "Successfully Loaded.");
    })
  })

  const rest = new REST({ version: '10' }).setToken(ClientToken);

  try {
    await rest.put(Routes.applicationCommands(ClientID), { body: slashArray })
  } catch (error) {
    console.error(error);
  }
}