import { Div, PaintStyle } from "comicvm-dom";
import { SVG, SVGCircle } from "../svg";
import { Animator, LineAnimation } from "../anim";
import Penta from "./Penta";

export const PRIMARY_COLOR = "#2e878a";
export const BACKGROUND_COLOR = "#fff";

export function createPentaPaintingDemo(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 400,
    })

    const penta = new Penta(300, 200, 150)

    svg.add(...[
            penta.head,
            penta.elbowLeft,
            penta.kneeLeft,
            penta.kneeRight,
            penta.elbowRight,

            penta.shoulderLeft,
            penta.hipLeft,
            penta.hipRight,
            penta.shoulderRight,
            penta.pubis,

        ]
            .map((point, index) =>
                new SVGCircle(point.x, point.y, 5,
                    PaintStyle.fillAndStroke(PRIMARY_COLOR, colorFromIndex(index), 2)
                )
            )
    )

    svg.add(...[
            penta.neck,
            penta.scapulaLeft,
            penta.scapulaRight,
            penta.ischiumLeft,
            penta.ischiumRight,
        ]
            .map(point =>
                new SVGCircle(point.x, point.y, 5,
                    PaintStyle.fillAndStroke(BACKGROUND_COLOR, PRIMARY_COLOR, 2)
                )
            )
    )

    new Animator("Penta Painting").start(
        LineAnimation.fromLines(
            svg,
            300,
            PaintStyle.stroke(PRIMARY_COLOR, 2),

            penta.leftSide,
            penta.rightExt,
            penta.upperArms,
            penta.leftExt,
            penta.rightSide,

            penta.spine,
            penta.armLeft,
            penta.legLeft,
            penta.armRight,
            penta.legRight,
        )
    );

    return Div.create({container})
        .append("<h2>Penta Painting</h2>")
        .append(svg);


    function colorFromIndex(index) {
        return [
            "lime",
            "magenta",
            "orange",
            "orange",
            "magenta",
        ][index] || BACKGROUND_COLOR
    }
}
