const { ChatInputCommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, Client } = require("discord.js");
const { aspectRatio, samplers, styles } = require("../../configuration/choices");
const { ProdiaKey } = require("../../configuration/config.json")

const { Prodia } = require("prodia.js");
const prodia = new Prodia(ProdiaKey);

const data = {
    type: ApplicationCommandType.ChatInput,
    name: "imagine",
    description: "Generate awesome images.",
    options: [
        {
            name: "prompt",
            description: "Enter the prompt to generate image.",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "model",
            description: "Enter the model to get type of image.",
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: "negative",
            description: "Enter the negative prompt to avoid from image.",
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: "style",
            description: "Select style of the image to generate.",
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: styles
        },
        {
            name: "steps",
            description: "Enter steps require to generate image.",
            type: ApplicationCommandOptionType.Number,
            required: false
        },
        {
            name: "cfg_scale",
            description: "Enter cfg scale to make your image more precise to prompt.",
            type: ApplicationCommandOptionType.Number,
            required: false
        },
        {
            name: "sampler",
            description: "Select sampler.",
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: samplers
        },
        {
            name: "aspect_ratio",
            description: "Select aspect ratio of image to generate.",
            type: ApplicationCommandOptionType.String,
            require: false,
            choices: aspectRatio
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

    const prompt = interaction.options.getString("prompt"),
        model = interaction.options.getString("model") || "absolutereality_v181.safetensors [3d9d4d2b]",
        negative_prompt = interaction.options.getString("negative"),
        style_preset = interaction.options.getString("style"),
        steps = interaction.options.getNumber("steps"),
        cfg_scale = interaction.options.getNumber("cfg_scale"),
        sampler = interaction.options.getString("sampler"),
        aspect_ratio = interaction.options.getString("aspect_ratio");

    // This will store all models name in collection rather fetching every time.
    if (!client.models.get("sd")) {
        client.models.set("sd", await prodia.getSDmodels())
    }

    if (!client.models.get("sd").includes(model)) return interaction.followUp({
        content: "No such model.",
        ephemeral: true
    });

    // Generating image...
    const generate = await prodia.generateImage({
        model: model,
        prompt: prompt,
        negative_prompt: negative_prompt ? negative_prompt : 'worst quality, normal quality, low quality, low res, blurry, text, watermark, logo, banner, extra digits, cropped, jpeg artifacts, signature, username, error, sketch ,duplicate, ugly, monochrome, horror, geometry, mutation, disgusting, nsfw, nude, censored',
        style_preset: style_preset ? style_preset : 'enhance',
        steps: steps ? steps : 20,
        cfg_scale: cfg_scale ? cfg_scale : 9,
        sampler: sampler ? sampler : 'Euler a',
        aspect_ratio: aspect_ratio ? aspect_ratio : 'square'
    });

    while (generate.status !== "succeeded" && generate.status !== "failed") {
        new Promise((resolve) => setTimeout(resolve, 250));

        const job = await prodia.getJob(generate.job);

        if (job.status === "succeeded") {
            return interaction.editReply(job.imageUrl);
        }
    }
}


module.exports = { data, perms, callback }