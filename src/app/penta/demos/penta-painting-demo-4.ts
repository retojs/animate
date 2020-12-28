import { Line } from "comicvm-geometry-2d"
import { ArrowKeyInput, Div, PaintStyle } from "comicvm-dom"
import { SVG, SVGCircle } from "../../svg"
import { Animation, Animator, LineAnimation, LineAnimationSection, SVGShapeAnimationFactory } from "../../anim"
import { Penta } from "../Penta"
import { PentaMan } from "../PentaMan";
import { addPentaPolygon } from "../addPentaPolygon";
import { MappingType, PentaManAnimationGenerator } from "../PentaManAnimationGenerator";

const BACKGROUND_COLOR = "white"
const GOLD_COLOR_FILL = "rgba(255, 190, 10, 0.3)"
const BROWN = "rgba(100, 50, 35, 1)"
const COPPER = "rgba(165, 60, 0, 1)"
const TRANSPARENT_3_COPPER = "rgba(165, 60, 0, 0.3)"
const TRANSPARENT_5_COPPER = "rgba(165, 60, 0, 0.5)"
const TRANSPARENT_9_YELLOW = "rgba(255, 255, 0, 0.9)"
const TRANSPARENT_3_YELLOW = "rgba(255, 255, 0, 0.3)"
const TRANSPARENT_5_YELLOW = "rgba(255, 255, 0, 0.5)"

export const DEFAULT_DURATION = 1500
export const STARTOVER_DELAY = 3000

const goldFill = PaintStyle.fill(GOLD_COLOR_FILL)
const yellowSpots = PaintStyle.fillAndStroke(BACKGROUND_COLOR, "rgba(255, 255, 0, 1)", 2)
const brownThinLine = PaintStyle.fillAndStroke("transparent", BROWN, 0.5)
const pentagramLines = PaintStyle.stroke(COPPER, 2.5)
const centralLines = PaintStyle.stroke(TRANSPARENT_9_YELLOW, 2.5)
const pentagramLinesBold = PaintStyle.stroke(COPPER, 3.5)
const centralLinesBold = PaintStyle.stroke(TRANSPARENT_9_YELLOW, 3.5)
const pentagramLinesDisabled = PaintStyle.stroke(TRANSPARENT_3_COPPER, 2.5)
const centralLinesDisabled = PaintStyle.stroke(TRANSPARENT_3_YELLOW, 2.5)
const pentagramLinesThin = PaintStyle.stroke(TRANSPARENT_5_COPPER, 2.5)
const centralLinesThin = PaintStyle.stroke(TRANSPARENT_5_YELLOW, 2.5)
const pentaManSpots = PaintStyle.fillAndStroke(BROWN, "white", 3)
const centralSpots = PaintStyle.fillAndStroke(COPPER, TRANSPARENT_9_YELLOW, 4)

export function createPentaPaintingDemo4(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 700,
    })

    svg.onClick = (e: MouseEvent) => {
        console.log("svg clicked: ", e.offsetX, e.offsetY)
    }

    const pentaPainting = new Animator("Penta Painting 4", STARTOVER_DELAY)

    pentaPainting.start(createAnimations(svg));

    return Div.create({container})
        .append("<h2>More Penta Painting</h2>")
        .append(svg)
        .append(ArrowKeyInput.create({
            name: "zoom", onKeyUp: () => 0
        }))
}


function createAnimations(svg: SVG) {
    const pentaMan = new PentaMan(300, 382, 580)
    const penta = new Penta(300, 300, 200)

    addBackgroundShapes(penta, pentaMan, svg);

    const pentaLineAnimation = createPentaLineAnimation(penta, svg, 0, pentagramLines, centralLines)

    const animationGenerator = new PentaManAnimationGenerator(pentaLineAnimation, pentaMan, penta)

    const manAnimation = animationGenerator.mapAnimation(pentaLineAnimation, MappingType.PENTA_TO_MAN)
    manAnimation.moveBehind(pentaLineAnimation.firstSection as LineAnimationSection)

    animationGenerator.connectionGaps = 5
    const connectedLineAnimation = animationGenerator.toConnectedLineAnimation(
        pentaLineAnimation,
        MappingType.PENTA_TO_MAN,
        (style: PaintStyle) => {
            if (style.strokeStyle === pentagramLines.strokeStyle) {
                style.strokeStyle = pentagramLinesThin.strokeStyle
            }
            if (style.strokeStyle === centralLines.strokeStyle) {
                style.strokeStyle = centralLinesThin.strokeStyle
            }

            return style
        })

    pentaLineAnimation.shiftBy(5 * DEFAULT_DURATION)
    connectedLineAnimation.shiftBy(5 * DEFAULT_DURATION)

    animationGenerator.replaceLineStyle(
        pentaLineAnimation,
        pentagramLines,
        pentagramLinesBold,
        centralLines,
        centralLinesBold
    )

    manAnimation.onEnd = () => {
        setTimeout(() => animationGenerator.replaceLineStyle(
            manAnimation,
            pentagramLines,
            pentagramLinesDisabled,
            centralLines,
            centralLinesDisabled
            ),
            500)
    }

    connectedLineAnimation.onEnd = () => {
        setTimeout(() => animationGenerator.replaceLineStyle(
            manAnimation,
            pentagramLinesDisabled,
            pentagramLines,
            centralLinesDisabled,
            centralLines
            ),
            STARTOVER_DELAY + 1)
    }

    addForegroundShapes(penta, pentaLineAnimation, svg);

    svg.insertBefore(
        (pentaLineAnimation.sections[0] as LineAnimationSection).line,
        ...pentaMan.getPentagramSpots(3, pentaManSpots)
    )
    svg.insertBefore(
        (pentaLineAnimation.sections[0] as LineAnimationSection).line,
        ...pentaMan.getCentralSpots(4, centralSpots)
    )

    return new Animation(
        manAnimation,
        connectedLineAnimation,
        pentaLineAnimation,
    )
}


function createPentaLineAnimation(
    penta: Penta | PentaMan,
    svg,
    startMillis = 0,
    pentagramStroke: PaintStyle,
    centralLineStroke: PaintStyle
): LineAnimation {

    const animation = LineAnimation.fromLines(
        svg,
        startMillis,
        DEFAULT_DURATION,
        centralLineStroke,

        new Line(penta.pubis, penta.neck),
    )

    const fromHeadAndNeckToShoulders = LineAnimation.fromLines(svg,
        startMillis + DEFAULT_DURATION,
        DEFAULT_DURATION / 2,
        pentagramStroke,
        [
            new Line(penta.neck, penta.head),
            new Line(penta.neck, penta.shoulderLeft),
            new Line(penta.neck, penta.shoulderRight),
        ]
    )
    fromHeadAndNeckToShoulders.applyStyle(centralLineStroke, 0)
    animation.add(fromHeadAndNeckToShoulders)

    animation.add(LineAnimation.fromLines(svg,
        startMillis + DEFAULT_DURATION * 1.5,
        DEFAULT_DURATION,
        pentagramStroke,
        [
            new Line(penta.shoulderLeft, penta.elbowLeft),
            new Line(penta.shoulderRight, penta.elbowRight),
            new Line(penta.head, penta.shoulderLeft),
            new Line(penta.head, penta.shoulderRight),
        ],
        [
            new Line(penta.shoulderRight, penta.pubis),
            new Line(penta.shoulderLeft, penta.pubis),
        ], [
            new Line(penta.pubis, penta.kneeLeft),
            new Line(penta.pubis, penta.kneeRight),
            new Line(penta.hipLeft, penta.kneeLeft),
            new Line(penta.hipRight, penta.kneeRight),
        ]
    ))

    // extended extremities

    animation.add(LineAnimation.fromLines(svg,
        startMillis + DEFAULT_DURATION * 1.5,
        DEFAULT_DURATION,
        centralLineStroke,

        new Line(penta.head, penta.overhead),
        [
            new Line(penta.elbowLeft, penta.handLeft),
            new Line(penta.elbowRight, penta.handRight)
        ],
        [],
        [
            new Line(penta.kneeLeft, penta.footLeft),
            new Line(penta.kneeRight, penta.footRight)
        ]
    ))

    // central arms line,

    animation.add(LineAnimation.fromLines(svg,
        startMillis + DEFAULT_DURATION * 2.5,
        DEFAULT_DURATION / 3,
        centralLineStroke,
        [
            new Line(penta.elbowLeft, penta.scapulaLeft),
            new Line(penta.elbowRight, penta.scapulaRight)
        ], [
            new Line(penta.scapulaLeft, penta.middle),
            new Line(penta.scapulaRight, penta.middle),
        ], [
            new Line(penta.middle, penta.hipRight),
            new Line(penta.middle, penta.hipLeft),
        ]
    ))

    // central leg line

    animation.add(LineAnimation.fromLines(svg,
        startMillis + DEFAULT_DURATION * 4.5,
        DEFAULT_DURATION / 3,
        centralLineStroke,
        [
            new Line(penta.kneeLeft, penta.ischiumLeft),
            new Line(penta.kneeRight, penta.ischiumRight),
        ], [
            new Line(penta.ischiumLeft, penta.middle),
            new Line(penta.ischiumRight, penta.middle),
        ], [
            new Line(penta.middle, penta.shoulderRight),
            new Line(penta.middle, penta.shoulderLeft),
        ]
    ))

    const factory = new SVGShapeAnimationFactory(svg, animation, centralSpots)

    factory.addDot(penta.middle, 0)
    factory.addDot(penta.neck, startMillis + DEFAULT_DURATION)
    factory.addDot(penta.scapulaRight, startMillis + DEFAULT_DURATION * (2.5 + 1 / 3))
    factory.addDot(penta.scapulaLeft, startMillis + DEFAULT_DURATION * (2.5 + 1 / 3))
    factory.addDot(penta.ischiumRight, startMillis + DEFAULT_DURATION * (4.5 + 1 / 3))
    factory.addDot(penta.ischiumLeft, startMillis + DEFAULT_DURATION * (4.5 + 1 / 3))

    return animation
}

function addBackgroundShapes(penta: Penta, pentaMan: PentaMan, svg: SVG) {

    svg.add(
        pentaMan.getImage(svg),
        new SVGCircle(penta.center.x, penta.center.y, penta.radius, brownThinLine),
        new SVGCircle(penta.center.x, penta.center.y, 77, brownThinLine),
        new SVGCircle(penta.center.x, penta.center.y, 29, brownThinLine)
    )

    addPentaPolygon(pentaMan, goldFill, svg)
}


function addForegroundShapes(penta: Penta, pentaLineAnimation: LineAnimation, svg: SVG) {
    svg.add(
        SVGCircle.create(penta.middle, 5, yellowSpots),
    )

    const factory = new SVGShapeAnimationFactory(svg, pentaLineAnimation, centralSpots)

    factory.addDot(penta.middle, 0)
    factory.addDot(penta.neck, 5 * DEFAULT_DURATION + DEFAULT_DURATION)
    factory.addDot(penta.scapulaRight, 5 * DEFAULT_DURATION + DEFAULT_DURATION * (2.5 + 1 / 3))
    factory.addDot(penta.scapulaLeft, 5 * DEFAULT_DURATION + DEFAULT_DURATION * (2.5 + 1 / 3))
    factory.addDot(penta.ischiumRight, 5 * DEFAULT_DURATION + DEFAULT_DURATION * (4.5 + 1 / 3))
    factory.addDot(penta.ischiumLeft, 5 * DEFAULT_DURATION + DEFAULT_DURATION * (4.5 + 1 / 3))
}
