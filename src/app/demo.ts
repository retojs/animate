import "../style/index.scss"

import { Div } from "comicvm-dom"
import { createSVGDemo } from "./svg"
import { drawingLinesDemo } from "./anim"
import { colorDemo, colorPaletteDemo } from "./style"
import { runPentaDemos } from "./penta";

export function runDemo() {

    const demo = Div.create({container: "demo"})

    createSVGDemo(demo)
    drawingLinesDemo(demo)
    colorPaletteDemo(demo)
    colorDemo(demo)

    runPentaDemos(demo)
}