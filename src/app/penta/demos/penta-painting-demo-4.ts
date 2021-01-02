import { Div, PaintStyle } from "comicvm-dom"
import { SVG, SVGCircle } from "../../svg"
import { Animation, Animator, DrawingLineAnimationSection, SVGShapeAnimationFactory } from "../../anim"
import { Penta } from "../Penta"
import { PentaMan } from "../PentaMan";
import { MappingType, PentaManAnimationGenerator } from "../PentaManAnimationGenerator";
import { addPentaPolygon } from "../addPentaPolygon";
import { createPentaLineAnimation } from "./createPentaLineAnimation";

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

    const animator = new Animator({
        name: "Drawing Connected Lines",
        repeatDelay: STARTOVER_DELAY,
        mouseWheelAnimate: svg.htmlElement
    })

    animator.start(createAnimations(svg));

    return Div.create({container})
        .append(`<h2>${animator.name}</h2>`)
        .append(svg)
}


function createAnimations(svg: SVG) {
    const pentaMan = new PentaMan(300, 382, 580)
    const penta = new Penta(300, 300, 200)

    addBackgroundShapes(penta, pentaMan, svg);

    const pentaLineAnimation = createPentaLineAnimation(penta, svg, 0, DEFAULT_DURATION, pentagramLines, centralLines)

    const animationGenerator = new PentaManAnimationGenerator(pentaLineAnimation, pentaMan, penta)

    const manAnimation = animationGenerator.mapAnimation(pentaLineAnimation, MappingType.PENTA_TO_MAN)
    manAnimation.moveBehind(pentaLineAnimation.firstSection as DrawingLineAnimationSection)

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

    pentaLineAnimation.shiftBy(7 * DEFAULT_DURATION)
    connectedLineAnimation.shiftBy(7 * DEFAULT_DURATION)

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
            2.5 * DEFAULT_DURATION)
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
        (pentaLineAnimation.parts[0] as DrawingLineAnimationSection).line,
        ...pentaMan.getPentagramSpots(3, pentaManSpots)
    )
    svg.insertBefore(
        (pentaLineAnimation.parts[0] as DrawingLineAnimationSection).line,
        ...pentaMan.getCentralSpots(4, centralSpots)
    )

    return new Animation(
        manAnimation,
        connectedLineAnimation,
        pentaLineAnimation,
    )
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


function addForegroundShapes(penta: Penta, animation: Animation, svg: SVG) {
    svg.add(
        SVGCircle.create(penta.middle, 5, yellowSpots),
    )

    const factory = new SVGShapeAnimationFactory(svg, animation, centralSpots)
    const startMillis = 7 * DEFAULT_DURATION

    factory.addDot(penta.middle, 0)
    factory.addDot(penta.neck, startMillis + DEFAULT_DURATION)
    factory.addDot(penta.scapulaRight, startMillis + DEFAULT_DURATION * (2.5 + 1 / 3))
    factory.addDot(penta.scapulaLeft, startMillis + DEFAULT_DURATION * (2.5 + 1 / 3))
    factory.addDot(penta.ischiumRight, startMillis + DEFAULT_DURATION * (4.5 + 1 / 3))
    factory.addDot(penta.ischiumLeft, startMillis + DEFAULT_DURATION * (4.5 + 1 / 3))
}
