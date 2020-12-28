import "../style/index.scss";

import { Div } from "comicvm-dom";
import { runPentaDemos } from "./penta";
import { createSVGDemo } from "./svg";
import { drawingLinesDemo } from "./anim";
import { colorDemo } from "./style";

export function runDemo() {

    const demo = Div.create({container: "demo"});

    createSVGDemo(demo);
    drawingLinesDemo(demo);
    colorDemo(demo);

    runPentaDemos(demo);
}