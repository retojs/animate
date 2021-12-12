import { Line, Point } from "comicvm-geometry-2d"
import { Animation, DrawingLineAnimation, DrawingLineAnimationBuilder, RadiusAnimationSection } from "../../anim"
import { SVGCircle } from "../../svg"
import { Penta } from "../Penta"
import { DEFAULT_DURATION } from "./penta-painting-demo-6"
import { PentaAnimationConfig } from "../PentaAnimationConfig";

export function createEssentialPentagramAnimation(config: PentaAnimationConfig): DrawingLineAnimation {

    const animation = createLineAnimations(config)

    addSpotAnimations(animation, config)

    return animation
}

function createLineAnimations({svg, penta, startMillis, duration, style}: PentaAnimationConfig): DrawingLineAnimation {

    const lineStyle = style.pentagramLine.clone()
    const lineWidth = lineStyle.lineWidth

    const animationBuilder = new DrawingLineAnimationBuilder({
        svg,
        startMillis,
        style: lineStyle,
    })

        .setDuration(duration * 0.35)
        .setPaintStyle(lineStyle)
        .addLines([
            new Line(penta.head, penta.shoulderLeft),
            new Line(penta.head, penta.shoulderRight),
            new Line(penta.neck, penta.shoulderLeft),
            new Line(penta.neck, penta.shoulderRight),
        ])

        .setStartMillis(startMillis + duration * 0.35)
        .setDuration(duration * 0.65 / 2)
        .addLines([
            new Line(penta.shoulderLeft, penta.hipLeft),
            new Line(penta.shoulderRight, penta.hipRight),
        ], [
            new Line(penta.hipLeft, penta.kneeLeft),
            new Line(penta.hipRight, penta.kneeRight),
        ])

        .setStartMillis(startMillis + duration * 0.35)
        .setDuration(duration * 0.65)
        .addLines([
            new Line(penta.shoulderLeft, penta.elbowLeft),
            new Line(penta.shoulderRight, penta.elbowRight),
        ])

        .setStartMillis(startMillis + duration)
        .setDuration(duration)
        .addLines([
            new Line(penta.kneeLeft, penta.pubis),
            new Line(penta.kneeRight, penta.pubis),
        ])

        .setStartMillis(startMillis + duration)
        .setDuration(duration * 0.65)
        .addLines([
            new Line(penta.elbowLeft, penta.hipLeft),
            new Line(penta.elbowRight, penta.hipRight)
        ])

        .setStartMillis(startMillis + duration * 1.65)
        .setDuration(duration * 0.35)
        .addLines([
            new Line(penta.hipLeft, penta.pubis),
            new Line(penta.hipRight, penta.pubis),
        ])

    lineStyle.lineWidth = lineWidth * 3 / 4

    const kreuz = penta.spine.intersection(penta.hips)

    animationBuilder
        .setStartMillis(startMillis + duration * 2)
        .setDuration(duration)
        .addLines([
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


    lineStyle.lineWidth = lineWidth / 2

    const diaphragm = penta.spine.intersection(new Line(penta.lungLeft, penta.lungRight))
    const middle = penta.spine.intersection(new Line(penta.lungLeft, penta.kidneyRight))

    animationBuilder
        .setStartMillis(startMillis + duration * 4)
        .setDuration(duration)
        .addLines([
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


function addSpotAnimations(animation: Animation, {svg, penta, startMillis, style}: PentaAnimationConfig) {

    const duration = DEFAULT_DURATION

    const spotTimingPenta = [
        startMillis + duration * 0.35, // shoulders
        startMillis + duration,        // elbows, knees
        startMillis + duration * 1.65, // hips
        startMillis + duration * 2,    // pubis
        startMillis + duration * 2.35,
        startMillis + duration * 3,
        startMillis + duration * 3.55,
        startMillis + duration * 4,
        startMillis + duration * 5,
    ]

    const spotTimingPentaMan = [
        startMillis + duration * 0.35, // shoulders
        startMillis + duration,        // elbows, knees
        startMillis + duration * 1.65, // hips
        startMillis + duration * 2,    // pubis
        startMillis + duration * 2.35,
        startMillis + duration * 3,
        startMillis + duration * 3.55,
        startMillis + duration * 4,
        startMillis + duration * 5,
    ]

    const timing = penta instanceof Penta ? spotTimingPenta : spotTimingPentaMan

    let radius = 10

    addAnimatedDot(penta.shoulderLeft, timing[0])
    addAnimatedDot(penta.shoulderRight, timing[0])

    addAnimatedDot(penta.elbowLeft, timing[1])
    addAnimatedDot(penta.elbowRight, timing[1])
    addAnimatedDot(penta.kneeLeft, timing[1])
    addAnimatedDot(penta.kneeRight, timing[1])

    addAnimatedDot(penta.hipLeft, timing[2])
    addAnimatedDot(penta.hipRight, timing[2])

    addAnimatedDot(penta.pubis, timing[3])

    radius = 15

    addAnimatedDot(penta.kidneyLeft, timing[4])
    addAnimatedDot(penta.kidneyRight, timing[4])

    radius = 10

    addAnimatedDot(penta.hipLeft, timing[5])
    addAnimatedDot(penta.hipRight, timing[5])
    addAnimatedDot(penta.shoulderLeft, timing[5])
    addAnimatedDot(penta.shoulderRight, timing[5])

    radius = 15

    addAnimatedDot(penta.lungLeft, timing[6])
    addAnimatedDot(penta.lungRight, timing[6])

    addAnimatedDot(penta.heart, timing[7])

    addAnimatedDot(penta.lungLeft, timing[8])
    addAnimatedDot(penta.lungRight, timing[8])
    addAnimatedDot(penta.kidneyLeft, timing[8])
    addAnimatedDot(penta.kidneyRight, timing[8])


    function addAnimatedDot(center: Point, startMillis: number) {
        animation.add(RadiusAnimationSection.getPulse(
            SVGCircle.fromPoint(center, radius, style.pentagramSpot, svg),
            Math.PI * 0.85,
            {
                startMillis,
                duration: duration / 2,
                visibleFrom: startMillis,
                visibleUntil: 0,
                style: style.pentagramSpot
            }
        ))
    }
}