import { Line, Point } from "comicvm-geometry-2d"
import { Div, PaintStyle } from "comicvm-dom"
import { SVG, SVGCircle } from "../svg"
import { Animator, LineAnimation, SVGShapeAnimationItem } from "../anim"
import Penta from "./Penta"

export const PRIMARY_COLOR = "#2e878a"
export const SECONDARY_COLOR = "#00bfc5"
export const TERTIARY_COLOR = "#73dc00"
export const BACKGROUND_COLOR = "#fff"

export const DEFAULT_DURATION = 500
export const STARTOVER_DELAY = 3000

export function createPentaPaintingDemo2(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 400,
    })

    const penta = new Penta(300, 200, 150)

    const pentaPainting = new Animator("More Penta Painting")

    pentaPainting.onEnd = () => pentaPainting.startOver(STARTOVER_DELAY)

    const animation = LineAnimation.fromLines(
        svg,
        DEFAULT_DURATION,
        PaintStyle.stroke(PRIMARY_COLOR, 2),

        penta.spine,
        [
            new Line(penta.neck, penta.elbowLeft),
            new Line(penta.neck, penta.elbowRight),
            new Line(penta.head, penta.shoulderLeft),
            new Line(penta.head, penta.shoulderRight),
        ],

        [
            new Line(penta.shoulderRight, penta.pubis),
            new Line(penta.shoulderLeft, penta.pubis),
            penta.armLeft.invert(),
            penta.armRight.invert(),
        ],
        [
            new Line(penta.hipLeft, penta.kneeLeft),
            new Line(penta.hipRight, penta.kneeRight),
            new Line(penta.pubis, penta.kneeLeft),
            new Line(penta.pubis, penta.kneeRight),
        ],
        [
            penta.legRight.invert(),
            penta.legLeft.invert(),
        ])

    animation.applyStyle(PaintStyle.stroke(SECONDARY_COLOR), 7, 8)
    animation.applyStyle(PaintStyle.stroke(TERTIARY_COLOR), 13, 14)

    displaySpot(penta.neck, DEFAULT_DURATION * 0.5)
    displaySpot(penta.scapulaLeft, DEFAULT_DURATION * 2.5)
    displaySpot(penta.scapulaRight, DEFAULT_DURATION * 2.5)
    displaySpot(penta.ischiumLeft, DEFAULT_DURATION * 4.5)
    displaySpot(penta.ischiumRight, DEFAULT_DURATION * 4.5)

    pentaPainting.start(animation);

    return Div.create({container})
        .append("<h2>More Penta Painting</h2>")
        .append(svg)


    function displaySpot(point: Point, startMillis: number, endMillis?: number) {
        animation.add(new SVGShapeAnimationItem(
            svg,
            createSpot(point),
            startMillis,
            endMillis
        ))
    }

    function createSpot(point: Point): SVGCircle {
        return new SVGCircle(point.x, point.y, 5,
            PaintStyle.fillAndStroke(BACKGROUND_COLOR, PRIMARY_COLOR, 2)
        )
    }
}
