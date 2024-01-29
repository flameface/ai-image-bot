const { ChatInputCommandInteraction, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { ProdiaKey } = require("../../configuration/config.json")

const { Prodia } = require("prodia.js");
const prodia = new Prodia(ProdiaKey);

const data = {
    type: ApplicationCommandType.ChatInput,
    name: "faceswap",
    description: "Swap face using ai.",
    options: [
        {
            name: "sourceurl",
            description: "Original image URL. Supports JPEG and PNG formats.",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "targeturl",
            description: "Image containing target face URL. Supports JPEG and PNG formats.",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ]
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
    await interaction.deferReply();

    const sourceUrl = interaction.options.getString("sourceurl");
    const targetUrl = interaction.options.getString("targeturl");

    const generate = await prodia.faceSwap({
        sourceUrl: sourceUrl,
        targetUrl: targetUrl
    });

    while (generate.status !== "succeeded" && generate.status !== "failed") {
        new Promise((resolve) => setTimeout(resolve, 250));

        const job = await prodia.getJob(generate.job);

        if (job.status === "succeeded") {
            return interaction.editReply({
                files: [job.imageUrl, sourceUrl, targetUrl]
            })
        }
    }
}

module.exports = { data, perms, callback }