const { InteractionType } = require("discord.js");
const client = require("../../Client");
const { Prodia } = require("prodia.js");
const config = require("../../configuration/index");
const prodia = new Prodia(config.prodiaKey);

client.on("interactionCreate", async (interaction) => {
    if (interaction.type !== InteractionType.ApplicationCommandAutocomplete) return;

    if (interaction.commandName === "imagine") {
        const models = await prodia.getModels();
        const focused = interaction.options.getFocused(true).value;

        if (focused.length == 0) return interaction.respond(
            models.slice(0, 25).map((model) => ({ name: model, value: model }))
        )

        const filter = models.filter((model) => model.includes(focused)).slice(0, 25)

        interaction.respond(
            filter.map((model) => ({ name: model, value: model }))
        )
    }
})