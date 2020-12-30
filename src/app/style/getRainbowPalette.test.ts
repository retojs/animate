import { getRainbowPalette } from "./getRainbowPalette";

describe("getRainbowPalette.ts", () => {

    let nofColors: number
    let palette: string[]

    beforeEach(() => {
        nofColors = 60
        palette = getRainbowPalette(nofColors)
    })

    test("the palette is defined", () => {
        expect(palette).toBeDefined()
        console.log("rainbow palette ", palette)
    })

    test("the palette is divided into 6 equal segments each of which starts with a basic color", () => {
        expect(palette[0]).toEqual("rgba(255, 0, 0, 1)")
        expect(palette[nofColors / 6]).toEqual("rgba(255, 255, 0, 1)")
        expect(palette[nofColors / 6 * 2]).toEqual("rgba(0, 255, 0, 1)")
        expect(palette[nofColors / 6 * 3]).toEqual("rgba(0, 255, 255, 1)")
        expect(palette[nofColors / 6 * 4]).toEqual("rgba(0, 0, 255, 1)")
        expect(palette[nofColors / 6 * 5]).toEqual("rgba(255, 0, 255, 1)")
    })
})