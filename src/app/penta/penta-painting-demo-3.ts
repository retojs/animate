import { Line, Point } from "comicvm-geometry-2d"
import { Div, PaintStyle } from "comicvm-dom"
import { SVG, SVGCircle } from "../svg"
import { Animator, LineAnimation, SVGShapeAnimationItem } from "../anim"
import Penta from "./Penta"
import { addPentaPolygon } from "./addPentaPolygon";

export const PRIMARY_COLOR = "#2e878a"
export const SECONDARY_COLOR = "rgba(200, 220, 200, 0.5)"
export const TERTIARY_COLOR = "#00bfc5"
export const BACKGROUND_COLOR = "#fff"
export const GOLD_COLOR = "rgba(225, 205, 75, 0.5)"

export const DEFAULT_DURATION = 500
export const STARTOVER_DELAY = 3000

const secondaryLineStyle = PaintStyle.fillAndStroke("transparent", SECONDARY_COLOR, 2)
const tertiaryLineStyle = PaintStyle.fillAndStroke("transparent", TERTIARY_COLOR, 2)
const secondarySpotStyle = PaintStyle.fillAndStroke(BACKGROUND_COLOR, SECONDARY_COLOR, 2)
const tertiarySpotStyle = PaintStyle.fillAndStroke(BACKGROUND_COLOR, TERTIARY_COLOR, 2)
const goldFill = PaintStyle.fill(GOLD_COLOR)
const goldStroke = PaintStyle.fillAndStroke(BACKGROUND_COLOR, GOLD_COLOR, 2)

export function createPentaPaintingDemo3(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 400,
    })

    const penta = new Penta(300, 200, 150)

    addBackgroundShapes(penta, svg);

    const pentaPainting = new Animator("Penta Painting 3")

    pentaPainting.onEnd = () => pentaPainting.startOver(STARTOVER_DELAY)

    const animation = LineAnimation.fromLines(
        svg,
        DEFAULT_DURATION,
        PaintStyle.stroke(PRIMARY_COLOR, 2),
        [
            new Line(penta.neck, penta.head),
            new Line(penta.neck, penta.pubis),
        ],
        [
            new Line(penta.head, penta.shoulderLeft),
            new Line(penta.head, penta.shoulderRight),
            new Line(penta.pubis, penta.shoulderLeft),
            new Line(penta.pubis, penta.shoulderRight),
        ],
        [
            new Line(penta.shoulderLeft, penta.hipRight),
            new Line(penta.shoulderRight, penta.hipLeft),
            new Line(penta.shoulderLeft, penta.elbowLeft),
            new Line(penta.shoulderRight, penta.elbowRight),

        ],
        [
            new Line(penta.hipLeft, penta.kidneyLeft),
            new Line(penta.hipRight, penta.kidneyRight),
            new Line(penta.elbowLeft, penta.hipRight),
            new Line(penta.elbowRight, penta.hipLeft),
        ],
        [
            new Line(penta.kidneyLeft, penta.shoulderRight),
            new Line(penta.kidneyRight, penta.shoulderLeft),
            new Line(penta.kidneyLeft, penta.kneeLeft),
            new Line(penta.kidneyRight, penta.kneeRight),
        ],
    )

    animation.applyStyle(tertiaryLineStyle, 0, 1, 12, 13, 14, 15, 16, 17)

    displaySpot(penta.scapulaRight, DEFAULT_DURATION * 3.5)
    displaySpot(penta.scapulaLeft, DEFAULT_DURATION * 3.5)
    displaySpot(penta.ischiumRight, DEFAULT_DURATION * 4.25)
    displaySpot(penta.ischiumLeft, DEFAULT_DURATION * 4.25)


    pentaPainting.start(animation);

    addForegroundShapes(penta, svg);

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
            tertiarySpotStyle
        )
    }
}


function addBackgroundShapes(penta: Penta, svg: SVG) {

    addPentaPolygon(penta, goldFill, svg)

    //
    // svg.add(...[
    //         penta.upperArms,
    //         penta.leftSide,
    //         penta.rightSide,
    //         penta.leftExt,
    //         penta.rightExt,
    //         penta.armLeft,
    //         penta.armRight,
    //     ]
    //         .map((line, index) =>
    //             SVGLine.fromLine(line, secondaryLineStyle), svg)
    // )
}


function addForegroundShapes(penta: Penta, svg: SVG) {

    svg.add(
        SVGCircle.fromPoint(penta.center, 5, goldStroke),
        SVGCircle.fromPoint(penta.neck, 5, tertiarySpotStyle),
    )
}