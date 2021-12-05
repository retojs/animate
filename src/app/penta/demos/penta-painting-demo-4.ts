import { Point } from "comicvm-geometry-2d";
import { Div, PaintStyle } from "comicvm-dom"
import { Animation, Animator, DrawingLineAnimationSection } from "../../anim"
import { createAnimationFactory } from "../../anim/animations/factory/createAnimationFactory";
import { ColorPalette, Colors } from "../../style";
import { SVG, SVGCircle } from "../../svg"
import { Penta } from "../Penta"
import { PentaMan } from "../PentaMan";
import { PentaManAnimationGenerator, PentaMappingType } from "../PentaManAnimationGenerator";
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

const color: Colors = ColorPalette.getColors()

export const DEFAULT_DURATION = 1500
export const STARTOVER_DELAY = 3000

const style = {
    transparent: PaintStyle.fillAndStroke(color.transparent, color.transparent),
    pentaManSpots: PaintStyle.fillAndStroke(color.val5.sat8.hue1, color.white, 3),
    centralSpots: PaintStyle.fillAndStroke(color.val5.sat8.hue1, TRANSPARENT_9_YELLOW, 4),
    pentaManOuterSpots: PaintStyle.fillAndStroke(color.white, color.val5.sat8.hue1, 2),
    pentaManInnerSpots: PaintStyle.fillAndStroke(color.white, color.val5.sat8.hue1, 2),
}

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

    const animator = new Animator(createAnimations(svg), {
        name: "Drawing Connected Lines",
        repeatDelay: STARTOVER_DELAY,
        htmlElement: svg.htmlElement
    })

    animator.start();

    return Div.create({container, styleClass: "demo"})
        .append(`<h2>${animator.name}</h2>`)
        .append(svg)
}


function createAnimations(svg: SVG) {
    const pentaMan = new PentaMan(300, 382, 580)
    const penta = new Penta(300, 285, 220)

    addBackgroundShapes(penta, pentaMan, svg);

    const pentaLineAnimation = createPentaLineAnimation(penta, svg, 0, DEFAULT_DURATION, pentagramLines, centralLines)

    const animationGenerator = new PentaManAnimationGenerator(pentaLineAnimation, pentaMan, penta)

    const manAnimation = animationGenerator.mapAnimation(pentaLineAnimation, PentaMappingType.PENTA_TO_MAN)
    manAnimation.moveBehind(pentaLineAnimation.firstSection as DrawingLineAnimationSection)

    animationGenerator.connectionGaps = 5
    const connectedLineAnimation = animationGenerator.toConnectedLineAnimation(
        pentaLineAnimation,
        PentaMappingType.PENTA_TO_MAN,
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

    manAnimation.notifyComplete = () => {
        setTimeout(() => animationGenerator.replaceLineStyle(
            manAnimation,
            pentagramLines,
            pentagramLinesDisabled,
            centralLines,
            centralLinesDisabled
            ),
            2.5 * DEFAULT_DURATION)
    }

    connectedLineAnimation.notifyComplete = () => {
        setTimeout(() => animationGenerator.replaceLineStyle(
            manAnimation,
            pentagramLinesDisabled,
            pentagramLines,
            centralLinesDisabled,
            centralLines
            ),
            STARTOVER_DELAY + 1)
    }

    addForegroundShapes(penta, pentaMan, pentaLineAnimation, svg);

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


function addForegroundShapes(penta: Penta, pentaMan: PentaMan, animation: Animation, svg: SVG) {
    svg.add(
        SVGCircle.fromPoint(penta.middle, 5, yellowSpots),
    )

    const factory = createAnimationFactory({svg, parent: animation, style: centralSpots})

    const startMillis = 7 * DEFAULT_DURATION

    const addDot = (center, startMillis) => factory.createCircleWithRadius(center, 5, {startMillis})

    addDot(penta.middle, 0)
    addDot(penta.neck, startMillis + DEFAULT_DURATION)
    addDot(penta.scapulaRight, startMillis + DEFAULT_DURATION * (2.5 + 1 / 3))
    addDot(penta.scapulaLeft, startMillis + DEFAULT_DURATION * (2.5 + 1 / 3))
    addDot(penta.ischiumRight, startMillis + DEFAULT_DURATION * (4.5 + 1 / 3))
    addDot(penta.ischiumLeft, startMillis + DEFAULT_DURATION * (4.5 + 1 / 3))

    pentaMan.getPentagramPoints()
        .forEach((point: Point, index: number) => {
            const spotStyle = (index < 5)
                ? style.pentaManOuterSpots
                : (index >= 10)
                    ? style.pentaManInnerSpots
                    : style.pentaManSpots

            factory.createCircleWithRadius(point, 3, {startMillis: 0, endMillis: 0, style: spotStyle})
        })

    pentaMan.getCentralPoints()
        .forEach(point => factory.createCircleWithRadius(point, 4, {
            startMillis: 0,
            endMillis: 0,
            style: style.centralSpots
        }))
}
