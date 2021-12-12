import { Line } from "comicvm-geometry-2d"
import { Div } from "comicvm-dom"
import { SVG, SVGCircle } from "../../svg"
import { Animator, DrawingLineAnimation, DrawingLineAnimationBuilder, DrawingLineAnimationSection } from "../../anim"
import { createAnimationFactory } from "../../anim/animations/factory/createAnimationFactory";
import { addPentaManImage } from "../addPentaManImage";
import { addPentaPolygon } from "../addPentaPolygon";
import { PentaMan } from "../PentaMan";
import { Penta } from "../Penta"
import { PENTA_STYLES, PentaAnimationConfig } from "../PentaAnimationConfig";

export const DEFAULT_DURATION = 1500
export const STARTOVER_DELAY = 5000

export function createPentaPaintingDemo3(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 700,
    })

    const penta = new Penta(300, 275, 200);
    const pentaMan = new PentaMan(300, 355, 550);

    const config: PentaAnimationConfig = {
        svg,
        penta,
        pentaMan,
        pentaStyle: PENTA_STYLES,
        startMillis: 0,
    }

    addPentaManImage(config)
    addPentaPolygon(config)

    const animation = createPentaLineAnimation(config)

    const animator = new Animator(animation, {
        name: "Drawing Lines with Background Image",
        repeatDelay: STARTOVER_DELAY,
        htmlElement: svg.htmlElement
    })

    animator.start();

    addTopDownPentagon(animation, config);
    addForegroundShapes(config);

    return Div.create({container, styleClass: "demo"})
        .append(`<h2>${animator.name}</h2>`)
        .append(svg)
}


function addForegroundShapes({penta, svg, pentaStyle}: PentaAnimationConfig) {

    svg.add(
        SVGCircle.fromPoint(penta.center, 5, pentaStyle.centralSpot),
        SVGCircle.fromPoint(penta.neck, 5, pentaStyle.centralSpot),
    )
}


function createPentaLineAnimation({penta, svg, pentaStyle}: PentaAnimationConfig): DrawingLineAnimation {

    const animation = new DrawingLineAnimationBuilder({
        svg,
        startMillis: 0,
        duration: DEFAULT_DURATION,
    })
        .setPaintStyle(pentaStyle.centralLine)
        .addLines(
            [
                new Line(penta.neck, penta.head),
                new Line(penta.neck, penta.pubis),
            ])
        .setPaintStyle(pentaStyle.pentagramLine)
        .addLines([ // 2
                new Line(penta.head, penta.shoulderLeft),
                new Line(penta.head, penta.shoulderRight),
                new Line(penta.pubis, penta.shoulderLeft),
                new Line(penta.pubis, penta.shoulderRight),
            ],
            [ // 6
                new Line(penta.shoulderLeft, penta.hipRight),
                new Line(penta.shoulderRight, penta.hipLeft),
                new Line(penta.shoulderLeft, penta.elbowLeft),
                new Line(penta.shoulderRight, penta.elbowRight),
            ],
            [ // 10
                new Line(penta.hipLeft, penta.kneeLeft),
                new Line(penta.hipRight, penta.kneeRight),
                new Line(penta.hipLeft, penta.kidneyLeft),
                new Line(penta.hipRight, penta.kidneyRight),
                new Line(penta.elbowLeft, penta.hipRight),
                new Line(penta.elbowRight, penta.hipLeft),
            ],
            [ // 16
                new Line(penta.kneeLeft, penta.pubis),
                new Line(penta.kneeRight, penta.pubis),
                new Line(penta.kidneyLeft, penta.shoulderRight),
                new Line(penta.kidneyRight, penta.shoulderLeft),
                new Line(penta.kidneyLeft, penta.kneeLeft),
                new Line(penta.kidneyRight, penta.kneeRight),
            ],
        ).build()

    animation.applyStyle(pentaStyle.centralLine, 14, 15, 18, 19, 20, 21)

    animation.moveSectionsBehind(animation.firstSection as DrawingLineAnimationSection, 12, 13, 14, 15, 16, 17)

    return animation
}

function addTopDownPentagon(animation, {svg, penta, pentaStyle}: PentaAnimationConfig) {

    const factory = createAnimationFactory({svg, parent: animation, style: pentaStyle.centralSpot})

    const addDot = (center, startMillis) => factory.createCircleWithRadius(center, 5, {startMillis})

    addDot(penta.scapulaRight, DEFAULT_DURATION * 3.5)
    addDot(penta.scapulaLeft, DEFAULT_DURATION * 3.5)
    addDot(penta.ischiumRight, DEFAULT_DURATION * 4.25)
    addDot(penta.ischiumLeft, DEFAULT_DURATION * 4.25)

    const insertBeforeShape = (animation.sectionList[0] as DrawingLineAnimationSection).line

    const addLine = (from, to, startMillis) =>
        factory.createLineFromPoints(from, to, {
            startMillis,
            style: pentaStyle.topDownPentagon,
            insertBeforeShape
        })

    addLine(penta.shoulderLeft, penta.shoulderRight, 0)
    addLine(penta.hipRight, penta.shoulderRight, DEFAULT_DURATION * 3.5)
    addLine(penta.hipLeft, penta.shoulderLeft, DEFAULT_DURATION * 3.5)
    addLine(penta.hipLeft, penta.pubis, DEFAULT_DURATION * 4.25)
    addLine(penta.hipRight, penta.pubis, DEFAULT_DURATION * 4.25)

}
