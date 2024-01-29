const styles = [
    { name: "3d-model", value: "3d-model" },
    { name: "analog-film", value: "analog-film" },
    { name: "anime", value: "anime" },
    { name: "cinematic", value: "cinematic" },
    { name: "comic-book", value: "comic-book" },
    { name: "digital-art", value: "digital-art" },
    { name: "enhance", value: "enhance" },
    { name: "fantasty-art", value: "fantasty-art" },
    { name: "isometric", value: "isometric" },
    { name: "line-art", value: "line-art" },
    { name: "low-poly", value: "low-poly" },
    { name: "neon-punk", value: "neon-punk" },
    { name: "origami", value: "origami" },
    { name: "photographic", value: "photographic" },
    { name: "pixel-art", value: "pixel-art" },
    { name: "texture", value: "texture" },
    { name: "craft-clay", value: "craft-clay" }
]

const samplers = [
    { name: "Euler", value: "Euler" },
    { name: "Euler a", value: "Euler a" },
    { name: "LMS", value: "LMS" },
    { name: "Heun", value: "Heun" },
    { name: "DPM2", value: "DPM2" },
    { name: "DPM2 a", value: "DPM2 a" },
    { name: "DPM++ 2S a", value: "DPM++ 2S a" },
    { name: "DPM++ 2M", value: "DPM++ 2M" },
    { name: "DPM++ SDE", value: "DPM++ SDE" },
    { name: "DPM fast", value: "DPM fast" },
    { name: "DPM adaptive", value: "DPM adaptive" },
    { name: "LMS Karras", value: "LMS Karras" },
    { name: "DPM2 Karras", value: "DPM2 Karras" },
    { name: "DPM2 a Karras", value: "DPM2 a Karras" },
    { name: "DPM++ 2S a Karras", value: "DPM++ 2S a Karras" },
    { name: "DPM++ 2M Karras", value: "DPM++ 2M Karras" },
    { name: "DPM++ SDE Karras", value: "DPM++ SDE Karras" },
    { name: "DDIM", value: "DDIM" },
    { name: "PLMS", value: "PLMS" }
]

const aspectRatio = [
    { name: "landscape", value: "landscape" },
    { name: "portrait", value: "portrait" },
    { name: "square", value: "square" }
]

module.exports = { styles, samplers, aspectRatio }