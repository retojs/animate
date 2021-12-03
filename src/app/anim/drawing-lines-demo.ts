import { Div, PaintStyle } from "comicvm-dom"
import { SVG } from "../svg"
import { Animator } from "./Animator"
import { DrawingLineAnimation } from "./animations/DrawingLineAnimation"

export const PRIMARY_COLOR = "#2e878a"

export function drawingLinesDemo(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 400,
    })

    const animation = DrawingLineAnimation.create(
        svg,
        200, 100,
        0,
        200,
        PaintStyle.stroke(PRIMARY_COLOR, 1.5)
    )
        .lineTo(500, 300)
        .lineTo(180, 130)
        .lineTo(490, 310, PaintStyle.stroke("red"))
        .lineTo(160, 160, PaintStyle.stroke("red"))
        .lineTo(480, 320, PaintStyle.stroke("red"))
        .lineTo(140, 190)
        .lineTo(470, 330)
        .lineTo(120, 220)
        .lineTo(460, 340)
        .lineTo(100, 250)
        .lineTo(450, 350)


    const drawingLines: Animator = new Animator(animation, {
        name: "Drawing Lines",
        mouseWheelAnimate: svg.htmlElement
    })

    drawingLines.onEnd = () => drawingLines.startOver(5000)

    drawingLines.start()


    return Div.create({container, styleClass: "demo"})
        .append("<h2>Drawing Lines</h2>")
        .append(svg)
}
