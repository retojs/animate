import { Div, PaintStyle } from "comicvm-dom";
import { Line, Point } from "comicvm-geometry-2d";
import { getColorPalette } from "../../style";
import { SVG, SVGCircle } from "../../svg";
import { Animator, DrawingLineAnimation } from "../../anim";
import { Penta } from "../Penta";

export const DEFAULT_DURATION = 2500
export const STARTOVER_DELAY = 5000

export const PRIMARY_COLOR = "#2e878a";
export const SECONDARY_COLOR = "#00bfc5"
export const BACKGROUND_COLOR = "#fff";

const secondaryLineStyle = PaintStyle.fillAndStroke("transparent", SECONDARY_COLOR, 1.5)

export function createPentaPaintingDemo(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 400,
    })

    const penta = new Penta(300, 200, 150)

    addBackgroundPentaPoints(penta, svg);

    const animation = DrawingLineAnimation.fromLines(
        svg,
        0,
        DEFAULT_DURATION,
        PaintStyle.stroke(PRIMARY_COLOR, 2),

        [
            new Line(penta.neck, penta.elbowLeft),
            new Line(penta.neck, penta.elbowRight),
        ],
        [
            penta.leftSide,
            penta.rightSide,
            penta.leftExt,
            penta.rightExt,
        ],
        [
            penta.spine,
            penta.armLeft.invert(),
            penta.armRight.invert(),
            penta.legLeft.invert(),
            penta.legRight.invert(),
        ],
        [
            new Line(penta.hipLeft, penta.spine.intersection(penta.hips)),
            new Line(penta.hipRight, penta.spine.intersection(penta.hips)),
            penta.leftTorso,
            penta.rightTorso,
            penta.leftRibs.invert(),
            penta.rightRibs.invert(),
        ]
    )

    animation.applyStyle(PaintStyle.stroke(SECONDARY_COLOR, 2.5), 11, 12, 13, 14, 15, 16)

    const animator = new Animator(animation, {
        name: "Drawing Pentagrams",
        repeatDelay: STARTOVER_DELAY,
        mouseWheelAnimate: svg.htmlElement
    })

    animator.start()

    addForegroundPentaPoints(penta, svg)

    return Div.create({container, styleClass: "demo"})
        .append(`<h2>${animator.name}</h2>`)
        .append(svg);
}

function addBackgroundPentaPoints(penta: Penta, svg: SVG) {

    svg.add(
        SVGCircle.fromPoint(penta.center, 9, secondaryLineStyle),
        SVGCircle.fromPoint(penta.center, 22, secondaryLineStyle),
        SVGCircle.fromPoint(penta.center, 57, secondaryLineStyle),
        SVGCircle.fromPoint(penta.center, 150, secondaryLineStyle),
    )

    svg.add(...[
            penta.head,
            penta.elbowLeft,
            penta.kneeLeft,
            penta.kneeRight,
            penta.elbowRight,
        ]
            .map((point, index) =>
                SVGCircle.fromPoint(point, 6,
                    PaintStyle.fillAndStroke(PRIMARY_COLOR, colorFromIndex(index * 12), 3)
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
                    PaintStyle.fillAndStroke("transparent", SECONDARY_COLOR, 1.5)
                )
            )
    )

    const SHOW_COLOR_PALETTE = true

    if (SHOW_COLOR_PALETTE) {
        svg.add(...
            Array.from(Array(60).keys())
                .map(i => i * 2 * Math.PI / 60)
                .map(angle => new Point(
                    300 + 100 * Math.sin(angle),
                    200 + 100 * Math.cos(angle)
                ))
                .map((point, index) =>
                    SVGCircle.fromPoint(point, 4,
                        PaintStyle.fill(colorFromIndex(index, -128 - (255 / 6)))
                    )
                )
        )
    }
}

function addForegroundPentaPoints(penta: Penta, svg: SVG) {

    svg.add(...[
            penta.shoulderLeft,
            penta.hipLeft,
            penta.pubis,
            penta.hipRight,
            penta.shoulderRight,
        ]
            .map((point, index) =>
                SVGCircle.fromPoint(point, 5,
                    PaintStyle.fillAndStroke(PRIMARY_COLOR, colorFromIndex(index * 12, -(255 / 6) + (255 / 10)), 2)
                )
            )
    )
}

let colorIndex: string[]

function colorFromIndex(index: number, offset: number = -(255 / 6)): string {

    if (!colorIndex || offset) {
        colorIndex = getColorPalette(60, offset)
        //  colorIndex = getRainbowPalette(60)
    }

    return colorIndex[index] || BACKGROUND_COLOR
}
