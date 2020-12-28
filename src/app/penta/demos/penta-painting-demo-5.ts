import { Div, PaintStyle } from "comicvm-dom"
import { SVG, SVGCircle } from "../../svg"
import { Animation, Animator, LineAnimationSection } from "../../anim"
import { Penta } from "../Penta"
import { PentaMan } from "../PentaMan";
import { addPentaPolygon } from "../addPentaPolygon";
import { createPentaLineAnimation } from "./createPentaLineAnimation";
import { MovingPentaLineAnimation } from "../MovingPentaLineAnimation";
import { PentaManRelation } from "../PentaManRelation";
import { MappingType, PentaManAnimationGenerator } from "../PentaManAnimationGenerator";

const BACKGROUND_COLOR = "white"
const GOLD_COLOR_FILL = "rgba(255, 190, 10, 0.3)"
const BROWN = "rgba(100, 50, 35, 1)"
const COPPER = "rgba(165, 60, 0, 1)"
const TRANSPARENT_5_COPPER = "rgba(165, 60, 0, 0.5)"
const TRANSPARENT_9_YELLOW = "rgba(255, 255, 0, 0.9)"
const TRANSPARENT_5_YELLOW = "rgba(255, 255, 0, 0.5)"

export const DEFAULT_DURATION = 1500
export const STARTOVER_DELAY = 3000

const goldFill = PaintStyle.fill(GOLD_COLOR_FILL)
const yellowSpots = PaintStyle.fillAndStroke(BACKGROUND_COLOR, "rgba(255, 255, 0, 1)", 2)
const brownThinLine = PaintStyle.fillAndStroke("transparent", BROWN, 0.5)
const pentagramLines = PaintStyle.stroke(COPPER, 2.5)
const centralLines = PaintStyle.stroke(TRANSPARENT_9_YELLOW, 2.5)
const pentagramLinesThin = PaintStyle.stroke(TRANSPARENT_5_COPPER, 2.5)
const centralLinesThin = PaintStyle.stroke(TRANSPARENT_5_YELLOW, 2.5)
const pentaManSpots = PaintStyle.fillAndStroke(BROWN, "white", 3)
const centralSpots = PaintStyle.fillAndStroke(COPPER, TRANSPARENT_9_YELLOW, 4)

export function createPentaPaintingDemo5(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 700,
    })

    svg.onClick = (e: MouseEvent) => {
        console.log("svg clicked: ", e.offsetX, e.offsetY)
    }

    const pentaPainting = new Animator("Penta Painting 5", STARTOVER_DELAY)

    pentaPainting.start(createAnimations(svg, true));

    return Div.create({container})
        .append("<h2>More Penta Painting</h2>")
        .append(svg)
}


function createAnimations(svg: SVG, withLineConnections: boolean) {
    const pentaMan = new PentaMan(300, 382, 580)
    const penta = new Penta(300, 300, 200)
    const relation = new PentaManRelation(pentaMan, penta)

    addBackgroundShapes(penta, pentaMan, svg);

    const pentaLineAnimation = createPentaLineAnimation(penta, svg, 0, DEFAULT_DURATION, pentagramLines, centralLines)

    const animationGenerator = new PentaManAnimationGenerator(pentaLineAnimation, pentaMan, penta)

    if (withLineConnections) {

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

        const movingConnectedLineAnimation = MovingPentaLineAnimation.fromConnectedLineAnimation(
            connectedLineAnimation,
            relation,
            0,
            100000
        )

        addForegroundShapes(penta, pentaMan, movingConnectedLineAnimation, svg)

        pentaLineAnimation.render(0)
        connectedLineAnimation.render(0)

        return new Animation(movingConnectedLineAnimation)

    } else {

        const movingLineAnimation = MovingPentaLineAnimation.fromLineAnimation(
            pentaLineAnimation,
            relation,
            0,
            100000
        )

        addForegroundShapes(penta, pentaMan, movingLineAnimation, svg)

        pentaLineAnimation.render(0)

        return new Animation(movingLineAnimation)
    }
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
        SVGCircle.create(penta.middle, 5, yellowSpots),
    )

    svg.insertBefore(
        (animation.parts[0] as LineAnimationSection).line,
        ...pentaMan.getPentagramSpots(3, pentaManSpots)
    )
    svg.insertBefore(
        (animation.parts[0] as LineAnimationSection).line,
        ...pentaMan.getCentralSpots(4, centralSpots)
    )
}
