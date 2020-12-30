import { Div } from "comicvm-dom"
import { SVG } from "../svg"
import { colorPaletteToSVG } from "./colorPaletteToSVG";
import { ColorPalette } from "./ColorPalette";

export function colorPaletteDemo(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 400,
    })

    const screenWidth = 600 - 2 * 20
    const screenHeight = 400 - 2 * 20
    const colorFieldWidth = screenWidth / 80
    const colorFieldHeight = screenHeight / 60
    const offsetX = 20
    const offsetY = 20

    const colorPalette = new ColorPalette()

    let colors: string[] = []

    for (let h = 0; h < colorPalette.nofColors; h++) {
        colors.push(colorPalette.color["hue" + h])
    }

    colorPaletteToSVG(
        colors.slice(0, 8),
        svg,
        offsetX,
        offsetY,
        colorFieldWidth * 10,
        colorFieldHeight * 10
    )
    colorPaletteToSVG(
        colors.slice(8, 16),
        svg,
        offsetX,
        offsetY + colorFieldHeight * 20,
        colorFieldWidth * 10,
        colorFieldHeight * 10
    )
    colorPaletteToSVG(
        colors.slice(16, 24),
        svg,
        offsetX,
        offsetY + colorFieldHeight * 40,
        colorFieldWidth * 10,
        colorFieldHeight * 10
    )

    for (let h = 0; h < colorPalette.nofColors; h++) {
        for (let i = 0; i < 10; i++) {
            colors = []
            for (let j = 9; j >= 0; j--) {
                colors.push(colorPalette.color["val" + i]["sat" + j]["hue" + h])
            }
            colorPaletteToSVG(
                colors,
                svg,
                offsetX + h % 8 * colorFieldWidth * 10,
                offsetY + ((2 * Math.floor(h / 8) + 1) * colorFieldHeight * 10) + (9 - i) * colorFieldHeight,
                colorFieldWidth,
                colorFieldHeight
            )
        }
    }

    return Div.create({container})
        .append("<h2>Color Palette</h2>")
        .append("<p>The standard color palette contains 24 colors with 10 x 10 shades of saturation and lightness (i.e. value).")
        .append("Each color shade is accessible by a property path like: </p>")
        .append("<pre>color.sat{s}.val{v}.hue{h}</pre>")
        .append("<pre>color.sat{s}.hue{h}</pre>")
        .append("<pre>color.val{v}.hue{h}</pre>")
        .append("<pre>color.hue{h}</pre>")
        .append(svg)
}
