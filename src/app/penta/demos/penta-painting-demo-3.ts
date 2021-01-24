import { Line } from "comicvm-geometry-2d"
import { Div, PaintStyle } from "comicvm-dom"
import { SVG, SVGCircle } from "../../svg"
import { Animator, DrawingLineAnimation, DrawingLineAnimationSection, ShowShapeAnimationFactory } from "../../anim"
import { addPentaPolygon } from "../addPentaPolygon";
import { PentaMan } from "../PentaMan";
import { Penta } from "../Penta"

export const DEFAULT_DURATION = 1500
export const STARTOVER_DELAY = 5000

const goldFill = PaintStyle.fill("rgba(255, 190, 10, 0.3)")
const pentaCircles = PaintStyle.fillAndStroke("transparent", "rgba(100, 50, 35, 1)", 0.5)
const pentagramLines = PaintStyle.stroke("rgba(165, 60, 0, 1)", 2.5)
const centralLines = PaintStyle.stroke("rgba(170, 255, 60, 1)", 2.5)
const yellowSpots = PaintStyle.fillAndStroke("white", "yellow", 2)
const yellowLines = PaintStyle.fillAndStroke("white", "yellow", 1)

export function createPentaPaintingDemo3(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 700,
    })

    const pentaMan = new PentaMan(300, 347, 500)
    const penta = new Penta(300, 300, 200)

    addBackgroundShapes(penta, pentaMan, svg);

    const animator = new Animator({
        name: "Drawing Lines with Background Image",
        repeatDelay: STARTOVER_DELAY,
        mouseWheelAnimate: svg.htmlElement
    })
    const animation = createPentaLineAnimation(penta, svg)

    animator.start(animation);

    addForegroundShapes(penta, svg);

    return Div.create({container})
        .append(`<h2>${animator.name}</h2>`)
        .append(svg)
}


function addBackgroundShapes(penta: Penta, pentaMan: PentaMan, svg: SVG) {

    svg.add(
        pentaMan.getImage(svg),

        new SVGCircle(penta.center.x, penta.center.y, penta.radius,
            pentaCircles
        ),
        new SVGCircle(penta.center.x, penta.center.y, 77,
            pentaCircles
        ),
        new SVGCircle(penta.center.x, penta.center.y, 29,
            pentaCircles
        )
    )

    addPentaPolygon(penta, goldFill, svg)
}


function addForegroundShapes(penta: Penta, svg: SVG) {

    svg.add(
        SVGCircle.create(penta.center, 5, yellowSpots),
        SVGCircle.create(penta.neck, 5, yellowSpots),
    )
}


function createPentaLineAnimation(penta: Penta | PentaMan, svg): DrawingLineAnimation {

    const animation = DrawingLineAnimation.fromLines(
        svg,
        0,
        DEFAULT_DURATION,
        pentagramLines,
        [
            new Line(penta.neck, penta.head),
            new Line(penta.neck, penta.pubis),
        ],
        [ // 2
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
    )

    animation.applyStyle(centralLines, 0, 1, 14, 15, 18, 19, 20, 21)

    animation.moveSectionsBehind(animation.firstSection as DrawingLineAnimationSection, 12, 13, 14, 15, 16, 17)

    const factory = new ShowShapeAnimationFactory(svg, animation, yellowSpots)

    factory.addDot(penta.scapulaRight, DEFAULT_DURATION * 3.5)
    factory.addDot(penta.scapulaLeft, DEFAULT_DURATION * 3.5)
    factory.addDot(penta.ischiumRight, DEFAULT_DURATION * 4.25)
    factory.addDot(penta.ischiumLeft, DEFAULT_DURATION * 4.25)

    factory.insertBeforeRef = (animation.sectionList[0] as DrawingLineAnimationSection).line
    factory.style = yellowLines

    factory.addLine(new Line(penta.shoulderLeft, penta.shoulderRight), 0)
    factory.addLine(new Line(penta.hipRight, penta.shoulderRight), DEFAULT_DURATION * 3.5)
    factory.addLine(new Line(penta.hipLeft, penta.shoulderLeft), DEFAULT_DURATION * 3.5)
    factory.addLine(new Line(penta.hipLeft, penta.pubis), DEFAULT_DURATION * 4.25)
    factory.addLine(new Line(penta.hipRight, penta.pubis), DEFAULT_DURATION * 4.25)

    return animation
}
