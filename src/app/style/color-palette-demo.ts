import { Div, Label } from "comicvm-dom"
import { SVG, SVGRect } from "../svg"
import { colorPaletteToSVG } from "./colorPaletteToSVG";
import { ColorPalette } from "./ColorPalette";

export function colorPaletteDemo(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 400,
    })

    const colorInspectorContainer = Div.create({styleClass: "color-inspector-container"})
    const colorInspector = Div.create({container: colorInspectorContainer, styleClass: "color-inspector"})
    const colorSample = Div.create({container: colorInspector, styleClass: "color-sample"})
    const colorInfo = Div.create({container: colorInspector, styleClass: "color-info"})
    const colorName = Label.create({container: colorInfo, styleClass: "color-label"})
    const colorComponents = Label.create({container: colorInfo, styleClass: "color-label"})

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

    const colorFields = [
        ...colorPaletteToSVG(
            colors.slice(0, 8),
            svg,
            offsetX,
            offsetY,
            colorFieldWidth * 10,
            colorFieldHeight * 10
        ),
        ...colorPaletteToSVG(
            colors.slice(8, 16),
            svg,
            offsetX,
            offsetY + colorFieldHeight * 20,
            colorFieldWidth * 10,
            colorFieldHeight * 10
        ),
        ...colorPaletteToSVG(
            colors.slice(16, 24),
            svg,
            offsetX,
            offsetY + colorFieldHeight * 40,
            colorFieldWidth * 10,
            colorFieldHeight * 10
        )
    ]

    colorFields.forEach((rect, index) => {
        rect.element.onmouseenter = () => {
            colorName.text = "color.hue" + index
            colorSample.htmlElement.style.backgroundColor = rect.style.fillStyle as string
            colorComponents.text = rect.style.fillStyle as string
        }
    })

    for (let h = 0; h < colorPalette.nofColors; h++) {
        for (let i = 0; i < 10; i++) {
            colors = []
            let colorNames = []

            for (let j = 9; j >= 0; j--) {
                colorNames.push("color.val" + i + ".sat" + j + ".hue" + h)
                colors.push(colorPalette.color["val" + i]["sat" + j]["hue" + h])
            }

            const colorRects: SVGRect[] = colorPaletteToSVG(
                colors,
                svg,
                offsetX + h % 8 * colorFieldWidth * 10,
                offsetY + ((2 * Math.floor(h / 8) + 1) * colorFieldHeight * 10) + (9 - i) * colorFieldHeight,
                colorFieldWidth,
                colorFieldHeight
            )

            colorRects.forEach((rect, index) => {
                rect.element.onmouseenter = () => {
                    colorName.text = colorNames[index]
                    colorSample.htmlElement.style.backgroundColor = rect.style.fillStyle as string
                    colorComponents.text = rect.style.fillStyle as string
                }
            })
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
        .append(colorInspectorContainer)
        .append(svg)
}
