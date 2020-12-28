import { Div, PaintStyle } from "comicvm-dom"
import { Animation, AnimationSection, Animator } from "../anim";
import { SVG, SVGRect, SVGShape } from "../svg"
import { getColorPalette } from "./getColorPalette";

const COLOR_PIXEL_SIZE = 20
const COLOR_COUNT = Math.round(560 / COLOR_PIXEL_SIZE)
const COLOR_PALETTES_COUNT = Math.round(360 / COLOR_PIXEL_SIZE)

export function colorDemo(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 400,
    })

    const colorField: SVGShape[][] = Array.from(Array(COLOR_PALETTES_COUNT).keys())
        .map(y =>
            Array.from(Array(COLOR_COUNT).keys())
                .map(x =>
                    new SVGRect(
                        20 + x * COLOR_PIXEL_SIZE,
                        20 + y * COLOR_PIXEL_SIZE,
                        COLOR_PIXEL_SIZE,
                        COLOR_PIXEL_SIZE,
                        null,
                        svg
                    )
                )
        )

    const colorAnim = new Animator("Color Palette");

    colorAnim.onEnd = () => colorAnim.startOver(0)

    colorAnim.start(new Animation(
        AnimationSection.create(0, 60 * 1000,
            (t) => {
                colorField.forEach((line, y) => {

                    const red = -t / 50;
                    const green = t / 40;
                    const blue = -t / 30;

                    const colors = getColorPalette(
                        COLOR_COUNT,
                        0,
                        [
                            0 + red - y * 8,
                            85 + green + y * 4,
                            170 + blue
                        ],
                        [128, 128, 128],
                        [64, 64, 64]
                    )

                    line.forEach((field: SVGShape, x) => {
                        field.style = PaintStyle.fill(colors[x])
                    })
                })
            }
        )
    ))

    return Div.create({container})
        .append("<h2>Color Palette</h2>")
        .append(svg)
}
