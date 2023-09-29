const { Client, CommandInteraction, ApplicationCommandOptionType, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Prodia } = require("prodia.js");
const config = require("../../configuration/index");
const prodia = new Prodia(config.prodiaKey);
const { v4: uuid } = require("uuid");
const Canvas = require("@napi-rs/canvas");

module.exports = {
    name: "imagine",
    description: "Imagine something beyond your imagination!",
    options: [
        {
            name: "model",
            description: "The model to use for the generation",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        },
        {
            name: "prompt",
            description: "The prompt to use for the generation",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "negative",
            description: "The negative prompt to use for the generation",
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: "aspect",
            description: "The aspect ratio of the image",
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: [
                { name: "landscape", value: "landscape" },
                { name: "portrait", value: "portrait" },
                { name: "square", value: "square" }
            ]
        },
        {
            name: "amount",
            description: "The amount of images to generate",
            type: ApplicationCommandOptionType.Integer,
            required: false,
            choices: [
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
            ]
        },
        {
            name: "sampler",
            description: "The sampler to use",
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: [
                {
                    name: "Euler",
                    value: "Euler"
                },
                {
                    name: "Euler a",
                    value: "Euler a"
                },
                {
                    name: "LMS",
                    value: "LMS"
                },
                {
                    name: "Heun",
                    value: "Heun"
                },
                {
                    name: "DPM2",
                    value: "DPM2"
                },
                {
                    name: "DPM2 a",
                    value: "DPM2 a"
                },
                {
                    name: "DPM++ 2S a",
                    value: "DPM++ 2S a"
                },
                {
                    name: "DPM++ 2M",
                    value: "DPM++ 2M"
                },
                {
                    name: "DPM++ SDE",
                    value: "DPM++ SDE"
                },
                {
                    name: "DPM fast",
                    value: "DPM fast"
                },
                {
                    name: "DPM adaptive",
                    value: "DPM adaptive"
                },
                {
                    name: "LMS Karras",
                    value: "LMS Karras"
                },
                {
                    name: "DPM2 Karras",
                    value: "DPM2 Karras"
                },
                {
                    name: "DPM2 a Karras",
                    value: "DPM2 a Karras"
                },
                {
                    name: "DPM++ 2S a Karras",
                    value: "DPM++ 2S a Karras"
                },
                {
                    name: "DPM++ 2M Karras",
                    value: "DPM++ 2M Karras"
                },
                {
                    name: "DPM++ SDE Karras",
                    value: "DPM++ SDE Karras"
                },
                {
                    name: "DDIM",
                    value: "DDIM"
                },
                {
                    name: "PLMS",
                    value: "PLMS"
                }
            ]
        },
        {
            name: "cfg-scale",
            description: "The cfg scale to use",
            type: ApplicationCommandOptionType.Integer,
            required: false
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const amount = interaction.options.getInteger("amount") || 1;
        const sampler = interaction.options.getString("sampler") || "DDIM";
        const cfgScale = interaction.options.getInteger("cfg-scale") || 9;
        const prompt = interaction.options.getString("prompt");
        const model = interaction.options.getString("model");

        // if (prompt.length < 10) return interaction.reply({ content: "Try to generate a creative thing with a long prompt.", ephemeral: true });

        const getModels = await prodia.getModels();

        if (!getModels.includes(model)) return interaction.reply({ content: "Invalid model", ephemeral: true });

        const msg = await interaction.reply({
            content: "Generating...",
            fetchReply: true
        })

        let images = [];
        let generating = true;

        for (let i = 0; i < amount; i++) {
            if (!generating) break;

            await msg.edit({
                content: `Generating image ${i + 1}/${amount}`
            })

            const generate = await prodia.generateImage({
                model: model,
                prompt: prompt,
                aspectRatio: interaction.options.getString("aspect") || "square",
                cfgScale: cfgScale,
                sampler: sampler,
                negativePrompt: interaction.options.getString("negative") || "blurry, pixelated, duplicate, deformed, low quality, ugly, bad anatomy, bad proportions, error, watermark, worst quality, signature, low contrast, uncreative",
                seed: Math.floor(Math.random() * 1000000000),
                upscale: true
            });

            while (generate.status !== "succeeded" && generate.status !== "failed") {
                new Promise((resolve) => setTimeout(resolve, 250));

                const job = await prodia.getJob(generate.job);

                if (job.status === "succeeded") {
                    images.push(job.imageUrl);
                    break;
                } else if (job.status === "failed") {
                    await msg.edit(`Failed to generate image ${i + 1}/${amount}`)
                }
            }
        }

        if (!generating) return;

        if (images.length === 0) return msg.edit("Failed to generate any images");

        if (images.length === 1) {
            await msg.edit({
                content: "Almost Ready"
            })

            const image = await Canvas.loadImage(images[0]).then(async (image) => {
                const canvas = Canvas.createCanvas(image.width, image.height);
                const ctx = canvas.getContext("2d");

                ctx.drawImage(image, 0, 0, image.width, image.height);

                return canvas.toBuffer("image/png");
            })

            const attachment = new AttachmentBuilder(image, `${uuid()}.png`);

            await msg.edit({
                files: [attachment],
                content: "Generated image",
            })

            return;
        }

        if (images.length === 2) {
            await msg.edit({
                content: "Almost Ready"
            })

            const image1 = await Canvas.loadImage(images[0]).then(async (image) => {
                const canvas = Canvas.createCanvas(image.width, image.height);
                const ctx = canvas.getContext("2d");

                ctx.drawImage(image, 0, 0, image.width, image.height);

                return canvas.toBuffer("image/png");
            })

            const image2 = await Canvas.loadImage(images[1]).then(async (image) => {
                const canvas = Canvas.createCanvas(image.width, image.height);
                const ctx = canvas.getContext("2d");

                ctx.drawImage(image, 0, 0, image.width, image.height);

                return canvas.toBuffer("image/png");
            })

            const attachment1 = new AttachmentBuilder(image1, `${uuid()}.png`);
            const attachment2 = new AttachmentBuilder(image2, `${uuid()}.png`);

            await msg.edit({
                files: [attachment1, attachment2],
                content: "Generated image"
            })

            return;
        }

        if (images.length === 3) {
            await msg.edit({
                content: "Almost Ready"
            })

            const image1 = await Canvas.loadImage(images[0]).then(async (image) => {
                const canvas = Canvas.createCanvas(image.width, image.height);
                const ctx = canvas.getContext("2d");

                ctx.drawImage(image, 0, 0, image.width, image.height);

                return canvas.toBuffer("image/png");
            })

            const image2 = await Canvas.loadImage(images[1]).then(async (image) => {
                const canvas = Canvas.createCanvas(image.width, image.height);
                const ctx = canvas.getContext("2d");

                ctx.drawImage(image, 0, 0, image.width, image.height);

                return canvas.toBuffer("image/png");
            })

            const image3 = await Canvas.loadImage(images[2]).then(async (image) => {
                const canvas = Canvas.createCanvas(image.width, image.height);
                const ctx = canvas.getContext("2d");

                ctx.drawImage(image, 0, 0, image.width, image.height);

                return canvas.toBuffer("image/png");
            })

            const attachment1 = new AttachmentBuilder(image1, `${uuid()}.png`);
            const attachment2 = new AttachmentBuilder(image2, `${uuid()}.png`);
            const attachment3 = new AttachmentBuilder(image3, `${uuid()}.png`);

            await msg.edit({
                files: [attachment1, attachment2, attachment3],
                content: "Generated image"
            })

            return;
        }

        if (images.length === 4) {
            await msg.edit({
                content: "Almost Ready",
            });

            const image1 = await Canvas.loadImage(images[0]).then(async (image) => {
                const canvas = Canvas.createCanvas(image.width, image.height);
                const ctx = canvas.getContext("2d");

                ctx.drawImage(image, 0, 0, image.width, image.height);

                return canvas.toBuffer("image/png");
            })

            const image2 = await Canvas.loadImage(images[1]).then(async (image) => {
                const canvas = Canvas.createCanvas(image.width, image.height);
                const ctx = canvas.getContext("2d");

                ctx.drawImage(image, 0, 0, image.width, image.height);

                return canvas.toBuffer("image/png");
            })

            const image3 = await Canvas.loadImage(images[2]).then(async (image) => {
                const canvas = Canvas.createCanvas(image.width, image.height);
                const ctx = canvas.getContext("2d");

                ctx.drawImage(image, 0, 0, image.width, image.height);

                return canvas.toBuffer("image/png");
            })

            const image4 = await Canvas.loadImage(images[3]).then(async (image) => {
                const canvas = Canvas.createCanvas(image.width, image.height);
                const ctx = canvas.getContext("2d");

                ctx.drawImage(image, 0, 0, image.width, image.height);

                return canvas.toBuffer("image/png");
            })

            const attachment1 = new AttachmentBuilder(image1, `${uuid()}.png`);
            const attachment2 = new AttachmentBuilder(image2, `${uuid()}.png`);
            const attachment3 = new AttachmentBuilder(image3, `${uuid()}.png`);
            const attachment4 = new AttachmentBuilder(image4, `${uuid()}.png`);

            await msg.edit({
                files: [attachment1, attachment2, attachment3, attachment4],
                content: "Generated image"
            })

            return;
        }
    }
}