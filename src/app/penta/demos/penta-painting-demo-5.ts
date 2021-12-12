import { Div, PaintStyle } from "comicvm-dom"
import { SVG, SVGCircle } from "../../svg"
import { Animation, Animator, MovingCircleAnimationSection, ShapeAnimationSection } from "../../anim"
import { Penta } from "../Penta"
import { PentaMan } from "../PentaMan";
import { PentaManRelation } from "../PentaManRelation";
import { MovingPentaLineAnimation } from "../MovingPentaLineAnimation";
import { PentaManAnimationGenerator, PentaMappingType } from "../PentaManAnimationGenerator";
import { PENTA_STYLES } from "../PentaAnimationConfig";
import { addPentaPolygon } from "../addPentaPolygon";
import { addPentaManImage } from "../addPentaManImage";
import { createPentaLineAnimation } from "./createPentaLineAnimation";

const BACKGROUND_COLOR = "white"
const TRANSPARENT = "rgba(0, 0, 0, 0.0)"
const GOLD_COLOR_FILL_FULL = "rgba(255, 180, 40, 1)"
const GOLD_COLOR_FILL = "rgba(255, 180, 40, 0.4)"
const COPPER = "rgba(165, 60, 0, 1)"
const COPPER_LIGHT = "rgba(165, 60, 0, 0.5)"
const TRANSPARENT_5_COPPER = "rgba(165, 60, 0, 0.5)"
const TRANSPARENT_9_YELLOW = "rgba(255, 255, 0, 0.9)"
const TRANSPARENT_5_YELLOW = "rgba(255, 255, 0, 0.5)"

export const DEFAULT_DURATION = 3500
export const STARTOVER_DELAY = 3000

const style = {
    transparent: PaintStyle.fillAndStroke(TRANSPARENT, TRANSPARENT),
    pentaManSpots: PaintStyle.fillAndStroke(COPPER, BACKGROUND_COLOR, 3),
    centralSpots: PaintStyle.fillAndStroke(COPPER, TRANSPARENT_9_YELLOW, 4),
    centralSpotsLight: PaintStyle.fillAndStroke(COPPER_LIGHT, TRANSPARENT_5_YELLOW, 4),
    pentaManOuterSpots: PaintStyle.fillAndStroke(GOLD_COLOR_FILL_FULL, COPPER, 2),
    pentaManInnerSpots: PaintStyle.fillAndStroke(GOLD_COLOR_FILL, COPPER, 2),
}

const yellowSpots = PaintStyle.fillAndStroke(BACKGROUND_COLOR, "rgba(255, 255, 0, 1)", 2)
const centralLines = PaintStyle.stroke(TRANSPARENT_9_YELLOW, 2.5)
const pentagramLinesThin = PaintStyle.stroke(TRANSPARENT_5_COPPER, 2.5)
const centralLinesThin = PaintStyle.stroke(TRANSPARENT_5_YELLOW, 2.5)

export function createPentaPaintingDemo5(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 700,
    })

    const animator = new Animator(
        createAnimations(svg, true), {
            name: "Moving Lines and Circles",
            repeatDelay: STARTOVER_DELAY,
            htmlElement: svg.htmlElement
        })

    animator.start();

    return Div.create({container, styleClass: "demo"})
        .append(`<h2>${animator.name}</h2>`)
        .append(svg)
}


function createAnimations(svg: SVG, withLineConnections: boolean) {
    const pentaMan = new PentaMan(300, 382, 580)
    // const pentaMan = new PentaMan(300, 362, 500)
    const penta = new Penta(300, 290, 225)
    const relation = new PentaManRelation(pentaMan, penta)

    const config = {svg, penta, pentaMan, pentaStyle: PENTA_STYLES, startMillis: 0, duration: DEFAULT_DURATION}

    addPentaManImage(config)
    addPentaPolygon(config)

    const pentaLineAnimation = createPentaLineAnimation(config)

    const animationGenerator = new PentaManAnimationGenerator(pentaLineAnimation, pentaMan, penta)

    if (withLineConnections) {

        const connectedLineAnimation = animationGenerator.toConnectedLineAnimation(
            pentaLineAnimation,
            PentaMappingType.PENTA_TO_MAN,
            (style: PaintStyle) => {
                if (style.strokeStyle === PENTA_STYLES.pentagramLine.strokeStyle) {
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
            DEFAULT_DURATION
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
            DEFAULT_DURATION
        )

        addForegroundShapes(penta, pentaMan, movingLineAnimation, svg)

        pentaLineAnimation.render(0)

        return new Animation(movingLineAnimation)
    }
}

function addForegroundShapes(penta: Penta, pentaMan: PentaMan, animation: Animation, svg: SVG) {
    svg.add(
        SVGCircle.fromPoint(penta.middle, 5, yellowSpots),
    )

    const pentaManPentagramSpots = pentaMan.getPentagramSpots(3, style.pentaManSpots)
    const pentaManCentralSpots = pentaMan.getCentralSpots(4, style.centralSpots)

    penta.getPentagramSpots(3, style.pentaManSpots)
        .forEach((sourceCircle: SVGCircle, index: number) => {
            const targetCircle = pentaManPentagramSpots[index]
            const anim = MovingCircleAnimationSection.fromCircles(
                svg,
                sourceCircle,
                targetCircle,
                0,
                DEFAULT_DURATION,
            )
            if (index < 5) {
                anim.circle.style = style.pentaManOuterSpots
                anim.circle.radius = 4
            }
            if (index >= 10) {
                anim.circle.style = style.pentaManInnerSpots
                anim.circle.radius = 11
            }

            animation.add(anim)
        })

    penta.getCentralSpots(4, style.centralSpots)
        .forEach((sourceCircle: SVGCircle, index: number) => {
            const targetCircle = pentaManCentralSpots[index]
            const anim = MovingCircleAnimationSection.fromCircles(
                svg,
                sourceCircle,
                targetCircle,
                0,
                DEFAULT_DURATION,
            )
            if (index === 6) {
                // anim.circle.style = style.transparent // overhead has no spot
            }

            animation.add(anim)
        })

    // pentaManPentagramSpots.forEach((sourceCircle: SVGCircle, index: number) => {
    //     const anim = new ShapeAnimationSection(
    //         svg,
    //         sourceCircle,
    //         0,
    //         0,
    //     )
    //
    //     animation.add(anim)
    // })

    pentaManCentralSpots.forEach((sourceCircle: SVGCircle) => {
        const anim = new ShapeAnimationSection({
            shape: sourceCircle.evolve({style: style.centralSpotsLight}),
            startMillis: 0,
            duration: Number.POSITIVE_INFINITY
        })

        animation.add(anim)
    })
}
