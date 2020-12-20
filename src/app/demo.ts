import "../style/index.scss";

import { Div } from "comicvm-dom";
import { createSVGDemo } from "./svg";
import { drawingLinesDemo } from "./anim";
import { createPentaPaintingDemo } from "./penta/penta-painting-demo";
import { createPentaPaintingDemo2 } from "./penta/penta-painting-demo-2";

export function runDemo() {

    const demo = Div.create({container: "demo"});

    createSVGDemo(demo);
    drawingLinesDemo(demo);
    createPentaPaintingDemo(demo);
    createPentaPaintingDemo2(demo);
}