import { Div, PaintStyle } from "comicvm-dom"
import { SVG, SVGCircle } from "../../svg"
import { Animation, Animator } from "../../anim"
import { Penta } from "../Penta"
import { PentaMan } from "../PentaMan";
import { addPentaPolygon } from "../addPentaPolygon";
import { addPentaManImage } from "../addPentaManImage";
import { createEssentialPentagramAnimation } from "./createEssentialPentagramAnimation";
import { PENTA_STYLES, PentaAnimationConfig } from "../PentaAnimationConfig";

export const DEFAULT_DURATION = 3000
export const STARTOVER_DELAY = 1000

const BACKGROUND_COLOR = "white"
const TRANSPARENT = "rgba(0, 0, 0, 0.0)"
const GOLD_COLOR_FILL_FULL = "rgba(255, 180, 40, 1)"
const GOLD_COLOR_FILL = "rgba(255, 180, 40, 0.4)"
const COPPER = "rgba(165, 60, 0, 1)"
const TRANSPARENT_9_YELLOW = "rgba(255, 255, 0, 0.9)"

const STYLE = {
    transparent: PaintStyle.fillAndStroke(TRANSPARENT, TRANSPARENT),
    pentaManSpots: PaintStyle.fillAndStroke(COPPER, BACKGROUND_COLOR, 3),
    centralSpots: PaintStyle.fillAndStroke(COPPER, TRANSPARENT_9_YELLOW, 4),
    central: PaintStyle.stroke(TRANSPARENT_9_YELLOW, 2.5),
    middleSpot: PaintStyle.fillAndStroke(BACKGROUND_COLOR, "rgba(255, 255, 0, 1)", 2),
    pentaManOuterSpots: PaintStyle.fillAndStroke(GOLD_COLOR_FILL_FULL, COPPER, 2),
    pentaManInnerSpots: PaintStyle.fillAndStroke(GOLD_COLOR_FILL, COPPER, 2),
    pentagonPolygonFill: PaintStyle.fill(GOLD_COLOR_FILL),
    pentagram: PaintStyle.stroke(COPPER, 2.5),
}

export function createPentaPaintingDemo6(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 700,
    })

    const animator = new Animator(
        createAnimations(svg),
        {
            name: "Essential Pentagramming",
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
    const penta = new Penta(300, 300, 200)

    const animationConfig: PentaAnimationConfig = {
        svg,
        penta,
        pentaMan,
        startMillis: 0,
        duration: DEFAULT_DURATION,
        style: PENTA_STYLES
    }

    addPentaManImage(animationConfig)
    addPentaPolygon(animationConfig)

    const animationPenta = createEssentialPentagramAnimation({penta, ...animationConfig})

    animationPenta.notifyComplete = () => {
        console.log("notifyComplete")
        //  setTimeout(() => animationPenta.remove(), STARTOVER_DELAY)
    }

    const animationPentaMan = createEssentialPentagramAnimation({penta: pentaMan, ...animationConfig})

    animationPentaMan.remove()

    addForegroundShapes(penta, pentaMan, animationPenta, svg)

    return animationPenta
}

function addForegroundShapes(penta: Penta, pentaMan: PentaMan, animation: Animation, svg: SVG) {
    svg.add(
        SVGCircle.fromPoint(penta.middle, 5, STYLE.middleSpot),
    )
}

