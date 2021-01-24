import { Div, PaintStyle } from "comicvm-dom"
import { SVG, SVGCircle } from "../../svg"
import { Animation, Animator } from "../../anim"
import { Penta } from "../Penta"
import { PentaMan } from "../PentaMan";
import { addPentaPolygon } from "../addPentaPolygon";
import { createEssentialPentagramAnimation } from "./createEssentialPentagramAnimation";

export const DEFAULT_DURATION = 1500
export const STARTOVER_DELAY = 3000

const BACKGROUND_COLOR = "white"
const TRANSPARENT = "rgba(0, 0, 0, 0.0)"
const GOLD_COLOR_FILL = "rgba(255, 180, 40, 0.4)"
const BROWN = "rgba(100, 50, 35, 1)"
const COPPER = "rgba(165, 60, 0, 1)"
const TRANSPARENT_9_YELLOW = "rgba(255, 255, 0, 0.9)"

const STYLE = {
    transparent: PaintStyle.fillAndStroke(TRANSPARENT, TRANSPARENT),
    pentaManSpots: PaintStyle.fillAndStroke(COPPER, BACKGROUND_COLOR, 3),
    centralSpots: PaintStyle.fillAndStroke(COPPER, TRANSPARENT_9_YELLOW, 4),
    centralLine: PaintStyle.stroke(TRANSPARENT_9_YELLOW, 2.5),
    middleSpot: PaintStyle.fillAndStroke(BACKGROUND_COLOR, "rgba(255, 255, 0, 1)", 2),
    pentaManOuterSpots: PaintStyle.fillAndStroke(BACKGROUND_COLOR, COPPER, 2),
    pentaManInnerSpots: PaintStyle.fillAndStroke(BACKGROUND_COLOR, COPPER, 2),
    pentagonPolygonFill: PaintStyle.fill(GOLD_COLOR_FILL),
    pentagramLine: PaintStyle.stroke(COPPER, 2.5),
    brownThinLine: PaintStyle.fillAndStroke("transparent", BROWN, 0.5),
}

export function createPentaPaintingDemo6(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 700,
    })

    const animator = new Animator({
        name: "Essential Pentagramming",
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

    const animationPenta = createEssentialPentagramAnimation({
        penta,
        svg,
        startMillis: 0,
        duration: DEFAULT_DURATION,
        style: {
            pentagramLine: STYLE.pentagramLine,
            centralLine: STYLE.centralLine
        }
    })

    animationPenta.onEnd = () => {
        console.log("on end called")
        setTimeout(() => animationPenta.remove(), STARTOVER_DELAY)
    }

    const animationPentaMan = createEssentialPentagramAnimation({
        penta: pentaMan,
        svg,
        startMillis: 0,
        duration: DEFAULT_DURATION,
        style: {
            pentagramLine: STYLE.pentagramLine,
            centralLine: STYLE.centralLine
        }
    })

    animationPentaMan.remove()

    addForegroundShapes(penta, pentaMan, animationPenta, svg)

    return animationPenta
}


function addBackgroundShapes(penta: Penta, pentaMan: PentaMan, svg: SVG) {

    svg.add(
        pentaMan.getImage(svg, 0.5),
        new SVGCircle(penta.center.x, penta.center.y, penta.radius, STYLE.brownThinLine),
        new SVGCircle(penta.center.x, penta.center.y, 77, STYLE.brownThinLine),
        new SVGCircle(penta.center.x, penta.center.y, 29, STYLE.brownThinLine)
    )

    addPentaPolygon(pentaMan, STYLE.pentagonPolygonFill, svg)
}


function addForegroundShapes(penta: Penta, pentaMan: PentaMan, animation: Animation, svg: SVG) {
    svg.add(
        SVGCircle.create(penta.middle, 5, STYLE.middleSpot),
    )

}

