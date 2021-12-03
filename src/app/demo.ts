import "../style/index.scss"
import { colorPaletteDemo, rainbowPaletteDemo } from "./style";
import { createSVGShapeAnimationDemo } from "./anim/animations/svg-shape-animation-demo";
import { runPentaDemos } from "./penta";
import { drawingLinesDemo } from "./anim";
import { createSVGDemo } from "./svg";


export function runDemo() {

    createSVGDemo("demos")
    createSVGShapeAnimationDemo("demos")
    drawingLinesDemo("demos")
    colorPaletteDemo("demos")
    rainbowPaletteDemo("demos")

    runPentaDemos("demos")
}