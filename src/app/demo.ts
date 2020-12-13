import { Canvas, Div, Font, PaintStyle } from "comicvm-dom";
import { Animator } from "./Animator";
import { LineAnimation } from "./animation-items/LineAnimation";

export const PRIMARY_COLOR = "#2e878a";

export function createAnimationDemo(): Div {

    const canvas = Canvas.create({
        width: 600,
        height: 400,
        paintStyleConfig: {font: new Font(30, "Arial")},
    })

    const animator = new Animator(canvas);

    animator.start(
        LineAnimation.create(200, 100,
            300,
            PaintStyle.stroke(PRIMARY_COLOR, 1))
            .lineTo(500, 120)
            .lineTo(210, 140)
            .lineTo(510, 160)
            .lineTo(220, 180)
            .lineTo(520, 200)
            .lineTo(230, 220)
            .lineTo(530, 240)
    );

    return Div.create({container: "demo"})
        .append("<h2>Drawing Lines</h2>")
        .append(canvas);
}
