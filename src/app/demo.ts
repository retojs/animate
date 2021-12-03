import "../style/index.scss"
import { colorPaletteDemo, rainbowPaletteDemo } from "./style";
import { createSVGAnimationDemo } from "./anim/animations/svg-shape-animation-demo";
import { runPentaDemos } from "./penta";
import { drawingLinesDemo } from "./anim";
import { createSVGDemo } from "./svg";


export function runDemo() {

    colorPaletteDemo("demos")
    rainbowPaletteDemo("demos")
    drawingLinesDemo("demos")
    createSVGDemo("demos")
    createSVGAnimationDemo("demos")

    runPentaDemos("demos")
}