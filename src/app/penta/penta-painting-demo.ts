import { Div, PaintStyle } from "comicvm-dom";
import { SVG, SVGCircle } from "../svg";
import { Animator, LineAnimation } from "../anim";
import { SECONDARY_COLOR } from "./penta-painting-demo-2";
import Penta from "./Penta";

export const PRIMARY_COLOR = "#2e878a";
export const BACKGROUND_COLOR = "#fff";

const secondaryLineStyle = PaintStyle.fillAndStroke("transparent", SECONDARY_COLOR, 1.5)

export function createPentaPaintingDemo(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 400,
    })

    const penta = new Penta(300, 200, 150)

    addBackgroundPentaPoints(penta, svg);

    const animation = LineAnimation.fromLines(
        svg,
        300,
        PaintStyle.stroke(PRIMARY_COLOR, 2),

        penta.upperArms,
        penta.leftSide,
        penta.rightSide,
        penta.leftExt,
        penta.rightExt,

        penta.spine,
        penta.armLeft,
        penta.armRight,
        penta.legLeft,
        penta.legRight,

        penta.hips,
        penta.leftTorso,
        penta.rightTorso,
        penta.leftRibs,
        penta.rightRibs,
    )

    animation.applyStyle(PaintStyle.stroke(SECONDARY_COLOR, 1.5), 10, 11, 12, 13, 14)

    new Animator("Penta Painting").start(animation);

    addForegroundPentaPoints(penta, svg)

    return Div.create({container})
        .append("<h2>Penta Painting</h2>")
        .append(svg);
}

function addBackgroundPentaPoints(penta: Penta, svg: SVG) {

    svg.add(
        SVGCircle.fromPoint(penta.center, 10, secondaryLineStyle),
        SVGCircle.fromPoint(penta.center, 57, secondaryLineStyle),
    )

    svg.add(...[
            penta.head,
            penta.elbowLeft,
            penta.kneeLeft,
            penta.kneeRight,
            penta.elbowRight,
        ]
            .map((point, index) =>
                SVGCircle.fromPoint(point, 5,
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
                SVGCircle.fromPoint(point, 5,
                    PaintStyle.fillAndStroke(BACKGROUND_COLOR, PRIMARY_COLOR, 2)
                )
            )
    )

    svg.add(...[
            penta.heart,
            penta.lungLeft,
            penta.lungRight,
            penta.kidneyLeft,
            penta.kidneyRight,
        ]
            .map(point =>
                SVGCircle.fromPoint(point, 12,
                    PaintStyle.fillAndStroke(BACKGROUND_COLOR, SECONDARY_COLOR, 1.5)
                )
            )
    )
}

function addForegroundPentaPoints(penta: Penta, svg: SVG) {

    svg.add(...[
            penta.shoulderLeft,
            penta.hipLeft,
            penta.hipRight,
            penta.shoulderRight,
            penta.pubis,
        ]
            .map(point =>
                SVGCircle.fromPoint(point, 5,
                    PaintStyle.fillAndStroke(PRIMARY_COLOR, BACKGROUND_COLOR, 2)
                )
            )
    )
}

function colorFromIndex(index) {
    return [
        "yellow",
        "magenta",
        "lime",
        "lime ",
        "magenta",
    ][index] || BACKGROUND_COLOR
}