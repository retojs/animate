import { Line, Point } from "comicvm-geometry-2d"
import { PaintStyle } from "comicvm-dom"
import { Animation, DrawingLineAnimation, RadiusAnimationSection } from "../../anim"
import { DrawingLineAnimationBuilder } from "../../anim/animations/DrawingLineAnimationBuilder";
import { createAnimationFactory } from "../../anim/animations/factory/createAnimationFactory";
import { ColorPalette } from "../../style"
import { SVGCircle } from "../../svg"
import { Penta } from "../Penta"
import { DEFAULT_DURATION } from "./penta-painting-demo-6"
import { PentaAnimationConfig } from "../PentaAnimationConfig";

export function createEssentialPentagramAnimation(config: PentaAnimationConfig): DrawingLineAnimation {

    const animation = createLineAnimations(config)

    addSpotAnimations(animation, config)

    return animation
}

function createLineAnimations(config: PentaAnimationConfig): DrawingLineAnimation {

    const penta = config.penta

    const lineStyle = config.style.pentagramLine.clone();
    lineStyle.lineWidth = 2.5

    const animationBuilder = new DrawingLineAnimationBuilder({
        svg: config.svg,
        startMillis: config.startMillis,
        defaultDuration: 1,
        defaultPaintStyle: config.style.centralLine,
    })
        .fromLines(
            new Line(penta.pubis, penta.head)
        )
        .setDefaultDuration(config.duration * 0.35)
        .setDefaultPaintStyle(lineStyle)
        .fromLines([
            new Line(penta.head, penta.shoulderLeft),
            new Line(penta.head, penta.shoulderRight),
            new Line(penta.neck, penta.shoulderLeft),
            new Line(penta.neck, penta.shoulderRight),
        ])

        .setStartMillis(config.startMillis + config.duration * 0.35)
        .setDefaultDuration(config.duration * 0.65 / 2)
        .fromLines([
            new Line(penta.shoulderLeft, penta.hipLeft),
            new Line(penta.shoulderRight, penta.hipRight),
        ], [
            new Line(penta.hipLeft, penta.kneeLeft),
            new Line(penta.hipRight, penta.kneeRight),
        ])

        .setStartMillis(config.startMillis + config.duration * 0.35)
        .setDefaultDuration(config.duration * 0.65)
        .fromLines([
            new Line(penta.shoulderLeft, penta.elbowLeft),
            new Line(penta.shoulderRight, penta.elbowRight),
        ])

        .setStartMillis(config.startMillis + config.duration)
        .setDefaultDuration(config.duration)
        .fromLines([
            new Line(penta.kneeLeft, penta.pubis),
            new Line(penta.kneeRight, penta.pubis),
        ])

        .setStartMillis(config.startMillis + config.duration)
        .setDefaultDuration(config.duration * 0.65)
        .fromLines([
            new Line(penta.elbowLeft, penta.hipLeft),
            new Line(penta.elbowRight, penta.hipRight)
        ])

        .setStartMillis(config.startMillis + config.duration * 1.65)
        .setDefaultDuration(config.duration * 0.35)
        .fromLines([
            new Line(penta.hipLeft, penta.pubis),
            new Line(penta.hipRight, penta.pubis),
        ])

    lineStyle.lineWidth = 2.0

    const kreuz = penta.spine.intersection(penta.hips)

    animationBuilder
        .setStartMillis(config.startMillis + config.duration * 2)
        .setDefaultDuration(config.duration)
        .fromLines([
            new Line(penta.pubis, penta.shoulderLeft),
            new Line(penta.pubis, penta.shoulderRight),
            new Line(kreuz, penta.hipLeft),
            new Line(kreuz, penta.hipRight),
        ], [
            new Line(penta.hipLeft, penta.heart),
            new Line(penta.hipRight, penta.heart),
            new Line(penta.shoulderLeft, penta.heart),
            new Line(penta.shoulderRight, penta.heart),
        ])


    lineStyle.lineWidth = 1.5

    const diaphragm = penta.spine.intersection(new Line(penta.lungLeft, penta.lungRight))
    const middle = penta.spine.intersection(new Line(penta.lungLeft, penta.kidneyRight))

    animationBuilder
        .setStartMillis(config.startMillis + config.duration * 4)
        .setDefaultDuration(config.duration)
        .fromLines([
            new Line(penta.heart, penta.kidneyLeft),
            new Line(penta.heart, penta.kidneyRight),
            new Line(diaphragm, penta.lungLeft),
            new Line(diaphragm, penta.lungRight),
        ], [
            new Line(penta.lungLeft, middle),
            new Line(penta.lungRight, middle),
            new Line(penta.kidneyLeft, middle),
            new Line(penta.kidneyRight, middle),
        ])

        .build()

    return animationBuilder.build()
}


function addSpotAnimations(animation: Animation, config: PentaAnimationConfig) {

    const color = ColorPalette.getColors()

    const animationFactory = createAnimationFactory({
        svg: config.svg,
        parent: animation,
        style: PaintStyle.fillAndStroke(color.yellow, color.val8.hue1, 2)
    })

    const spotTimingPenta = [
        config.startMillis + DEFAULT_DURATION * 0.35, // shoulders
        config.startMillis + DEFAULT_DURATION,        // elbows, knees
        config.startMillis + DEFAULT_DURATION * 1.65, // hips
        config.startMillis + DEFAULT_DURATION * 2,    // pubis
        config.startMillis + DEFAULT_DURATION * 2.35,
        config.startMillis + DEFAULT_DURATION * 3,
        config.startMillis + DEFAULT_DURATION * 3.55,
        config.startMillis + DEFAULT_DURATION * 4,
        config.startMillis + DEFAULT_DURATION * 5,
    ]

    const spotTimingPentaMan = [
        config.startMillis + DEFAULT_DURATION * 0.35, // shoulders
        config.startMillis + DEFAULT_DURATION,        // elbows, knees
        config.startMillis + DEFAULT_DURATION * 1.65, // hips
        config.startMillis + DEFAULT_DURATION * 2,    // pubis
        config.startMillis + DEFAULT_DURATION * 2.35,
        config.startMillis + DEFAULT_DURATION * 3,
        config.startMillis + DEFAULT_DURATION * 3.55,
        config.startMillis + DEFAULT_DURATION * 4,
        config.startMillis + DEFAULT_DURATION * 5,
    ]

    const penta = config.penta
    const timing = penta instanceof Penta ? spotTimingPenta : spotTimingPentaMan

    let radius = 8

    addAnimatedDot(penta.shoulderLeft, timing[0])
    addAnimatedDot(penta.shoulderRight, timing[0])

    radius = 10

    addAnimatedDot(penta.elbowLeft, timing[1])
    addAnimatedDot(penta.elbowRight, timing[1])
    addAnimatedDot(penta.kneeLeft, timing[1])
    addAnimatedDot(penta.kneeRight, timing[1])

    radius = 8

    addAnimatedDot(penta.hipLeft, timing[2])
    addAnimatedDot(penta.hipRight, timing[2])

    addAnimatedDot(penta.pubis, timing[3])

    radius = 6

    addAnimatedDot(penta.kidneyLeft, timing[4])
    addAnimatedDot(penta.kidneyRight, timing[4])

    radius = 8

    addAnimatedDot(penta.hipLeft, timing[5])
    addAnimatedDot(penta.hipRight, timing[5])
    addAnimatedDot(penta.shoulderLeft, timing[5])
    addAnimatedDot(penta.shoulderRight, timing[5])

    radius = 6

    addAnimatedDot(penta.lungLeft, timing[6])
    addAnimatedDot(penta.lungRight, timing[6])

    addAnimatedDot(penta.heart, timing[7])

    radius = 5

    addAnimatedDot(penta.lungLeft, timing[8])
    addAnimatedDot(penta.lungRight, timing[8])
    addAnimatedDot(penta.kidneyLeft, timing[8])
    addAnimatedDot(penta.kidneyRight, timing[8])


    function addAnimatedDot(center: Point, startMillis: number) {
        const shapeAnimation = animationFactory.createCircleWithRadius(center, radius, {
            startMillis,
            style: PaintStyle.fillAndStroke(color.yellow, color.val8.hue1, 2)
        })
        animationFactory.createStyleChange({
            shape: shapeAnimation.shape,
            startMillis: startMillis + 300,
            targetStyle: PaintStyle.fillAndStroke(color.transparent, color.transparent)
        })
        animation.add(RadiusAnimationSection.getSinglePulse(
            shapeAnimation.shape as SVGCircle,
            5,
            startMillis,
            DEFAULT_DURATION
        ))
    }
}