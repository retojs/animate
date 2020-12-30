import { getRainbowPalette } from "./getRainbowPalette";

export class ColorPalette {

    color: any = {}

    constructor(
        public nofColors = 24
    ) {
        this.setupHues()
        this.setupLightness()
        this.setupSaturation()

        this.color.black = "rgba(0, 0, 0, 1)"
        this.color.white = "rgba(255, 255, 255, 1)"

        // console.log("ColorPalette.color", this.color)
    }

    private setupHues() {

        const colors = getRainbowPalette(this.nofColors)

        this.color.red = colors[0]
        this.color.yellow = colors[this.nofColors / 6]
        this.color.green = colors[this.nofColors / 6 * 2]
        this.color.cyan = colors[this.nofColors / 6 * 3]
        this.color.blue = colors[this.nofColors / 6 * 4]
        this.color.magenta = colors[this.nofColors / 6 * 5]

        colors.forEach((color, index) => {
            this.color['hue' + index] = color
        })
    }

    private setupLightness() {

        Object.keys(this.color)
            .filter(name => typeof this.color[name] === "string")
            .forEach(name => {
                const color = this.color[name]

                this.createLightnessScale(color)
                    .forEach((shade, index) => {
                        this.color["val" + index] = this.color["val" + index] || {}
                        this.color["val" + index][name] = shade

                        this.createSaturationScale(shade)
                            .forEach((saturationShade, indexSaturation) => {
                                this.color["val" + index]["sat" + indexSaturation] = this.color["val" + index]["sat" + indexSaturation] || {}
                                this.color["val" + index]["sat" + indexSaturation][name] = saturationShade
                            })
                    })
            })
    }

    private setupSaturation() {

        Object.keys(this.color)
            .filter(name => typeof this.color[name] === "string")
            .forEach(name => {
                const color = this.color[name]

                this.createSaturationScale(color)
                    .forEach((shade, index) => {
                        this.color["sat" + index] = this.color["sat" + index] || {}
                        this.color["sat" + index][name] = shade

                        this.createLightnessScale(shade)
                            .forEach((lightnessShade, indexLightness) => {
                                this.color["sat" + index]["val" + indexLightness] = this.color["sat" + index]["val" + indexLightness] || {}
                                this.color["sat" + index]["val" + indexLightness][name] = lightnessShade
                            })
                    })
            })
    }

    createLightnessScale(color: string, nofLevels = 10): string[] {
        const [r, g, b] = this.colorFromString(color)
        const initialLightness = Math.max(r, g, b) / 255

        return Array.from(Array(nofLevels).keys())
            .map(i => {
                const lightness = (i + 1) / nofLevels
                return [
                    r / initialLightness * lightness,
                    g / initialLightness * lightness,
                    b / initialLightness * lightness,
                ]
            })
            .map(c => this.colorToString(c[0], c[1], c[2]))
    }

    createSaturationScale(color: string, nofLevels = 10): string[] {
        const [r, g, b] = this.colorFromString(color)
        const maxComponent = Math.max(r, g, b)

        return Array.from(Array(nofLevels).keys())
            .map(i => {
                const saturation = (i + 1) / nofLevels
                return [
                    r + (maxComponent - r) * (1 - saturation),
                    g + (maxComponent - g) * (1 - saturation),
                    b + (maxComponent - b) * (1 - saturation),
                ]
            })
            .map(c => this.colorToString(c[0], c[1], c[2]))
    }

    colorToString(r: number, g: number, b: number, a: number = 1.0) {
        r = Math.min(255, Math.max(0, Math.round(r)))
        g = Math.min(255, Math.max(0, Math.round(g)))
        b = Math.min(255, Math.max(0, Math.round(b)))
        a = (typeof a === 'number') ? a : 1.0
        return `rgba(${r},${g},${b},${a})`
    }

    colorFromString(color: string): number[] {
        color = color.trim()
        let values = color.substring(5, color.length - 1)
        return values.split(',').map(str => parseFloat(str))
    }

}