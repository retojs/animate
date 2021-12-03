import { Line } from "comicvm-geometry-2d"
import { Div, PaintStyle } from "comicvm-dom"
import { SVG } from "../../svg"
import { Animator, DrawingLineAnimation, DrawingLineAnimationSection, ShowShapeAnimationFactory } from "../../anim"
import { addPentaPolygon } from "../addPentaPolygon";
import { Penta } from "../Penta"

export const PRIMARY_COLOR = "#2e878a"
export const SECONDARY_COLOR = "#00bfc5"
export const TERTIARY_COLOR = "rgba(80, 230, 235, 1)"
export const BACKGROUND_COLOR = "#fff"

export const DEFAULT_DURATION = 1500
export const STARTOVER_DELAY = 3000

const goldFill = PaintStyle.fill("rgba(255, 190, 10, 0.3)")

export function createPentaPaintingDemo2(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 400,
    })

    const penta = new Penta(300, 200, 150)

    addPentaPolygon(penta, goldFill, svg)

    const animation = DrawingLineAnimation.fromLines(
        svg,
        0,
        DEFAULT_DURATION,
        PaintStyle.stroke(PRIMARY_COLOR, 2),

        new Line(penta.pubis, penta.neck),
        [
            new Line(penta.neck, penta.head),
            new Line(penta.neck, penta.shoulderLeft),
            new Line(penta.neck, penta.shoulderRight),
        ],
        [
            new Line(penta.shoulderLeft, penta.elbowLeft),
            new Line(penta.shoulderRight, penta.elbowRight),
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
        ],
        [
            new Line(penta.shoulderLeft, penta.hipRight),
            new Line(penta.shoulderRight, penta.hipLeft),
        ],
        [
            new Line(penta.hipLeft, penta.kidneyLeft),
            new Line(penta.hipRight, penta.kidneyRight),
        ])

    animation.applyStyle(PaintStyle.stroke(SECONDARY_COLOR), 0, 1, 10, 11)
    animation.applyStyle(PaintStyle.stroke(TERTIARY_COLOR), 16, 17)

    animation.moveSectionsBehind(animation.firstSection as DrawingLineAnimationSection, 7, 8, 13, 14)

    const factory = new ShowShapeAnimationFactory(svg, animation, PaintStyle.fillAndStroke(BACKGROUND_COLOR, SECONDARY_COLOR, 2))

    factory.addDot(penta.middle, DEFAULT_DURATION * 0.25)
    factory.addDot(penta.neck, DEFAULT_DURATION * 0.5)
    factory.addDot(penta.scapulaLeft, DEFAULT_DURATION * 2.5)
    factory.addDot(penta.scapulaRight, DEFAULT_DURATION * 2.5)
    factory.addDot(penta.ischiumLeft, DEFAULT_DURATION * 4.5)
    factory.addDot(penta.ischiumRight, DEFAULT_DURATION * 4.5)

    const animator = new Animator(animation, {
        name: "Drawing Essential Lines",
        repeatDelay: STARTOVER_DELAY,
        mouseWheelAnimate: svg.htmlElement
    })

    animator.start();

    return Div.create({container, styleClass: "demo"})
        .append(`<h2>${animator.name}</h2>`)
        .append(svg)

}
