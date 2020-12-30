import { ColorPalette } from "./ColorPalette"

describe("ColorPalette.ts", () => {

    let palette: ColorPalette

    beforeEach(() => {
        palette = new ColorPalette()
    })

    describe("The color property", () => {

        test("contains black and white ", () => {
            expect(palette.color.black).toBe("rgba(0, 0, 0, 1)")
            expect(palette.color.white).toBe("rgba(255, 255, 255, 1)")
        })

        test("contains the 6 basic colors", () => {
            ["red", "yellow", "green", "cyan", "blue", "magenta"].forEach(name =>
                expect(palette.color[name]).toBeDefined()
            )
        })

        test("contains the specified number of colors named hue{i}", () => {
            for (let i = 0; i < palette.nofColors; i++) {
                expect(palette.color["hue" + i]).toBeDefined()
            }
        })

        test("contains 10 lightness variations named val{i} for all colors", () => {
            for (let i = 0; i < 10; i++) {
                expect(palette.color["val" + i]).toBeDefined();
                for (let h = 0; h < palette.nofColors; h++) {
                    expect(palette.color["val" + i]["hue" + h]).toBeDefined()
                }
                ["red", "yellow", "green", "cyan", "blue", "magenta"].forEach(name =>
                    expect(palette.color["val" + i][name]).toBeDefined()
                )
            }
        })
        test("contains 10 saturation variations named sat{i} for all colors", () => {
            for (let i = 0; i < 10; i++) {
                expect(palette.color["sat" + i]).toBeDefined()
                for (let h = 0; h < palette.nofColors; h++) {
                    expect(palette.color["sat" + i]["hue" + h]).toBeDefined()
                }
                ["red", "yellow", "green", "cyan", "blue", "magenta"].forEach(name =>
                    expect(palette.color["sat" + i][name]).toBeDefined()
                )
            }
        })
        test("each saturation variation contains 10 lightness variations", () => {
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    expect(palette.color["sat" + i]["val" + j]).toBeDefined()
                }
            }
        })
        test("each lightness variation contains 10 saturation variations", () => {
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    expect(palette.color["val" + i]["sat" + j]).toBeDefined()
                }
            }
        })
        test("each combination of lightness and saturation contains the specified number of colors named hue{i}", () => {
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    for (let h = 0; h < palette.nofColors; h++) {
                        expect(palette.color["val" + i]["hue" + h]).toBeDefined()
                        expect(palette.color["sat" + i]["hue" + h]).toBeDefined()
                        expect(palette.color["val" + i]["sat" + j]["hue" + h]).toBeDefined()
                        expect(palette.color["sat" + i]["val" + j]["hue" + h]).toBeDefined()
                    }
                    ["red", "yellow", "green", "cyan", "blue", "magenta"].forEach(name => {
                        expect(palette.color["val" + i][name]).toBeDefined()
                        expect(palette.color["sat" + i][name]).toBeDefined()
                        expect(palette.color["val" + i]["sat" + j][name]).toBeDefined()
                        expect(palette.color["sat" + i]["val" + j][name]).toBeDefined()
                    })
                }
            }
        })
    })
})