import { Line } from "comicvm-geometry-2d";
import { DrawingLineAnimation, DrawingLineAnimationBuilder } from "../../anim";
import { PentaAnimationConfig } from "../PentaAnimationConfig";

export function createPentaLineAnimation(
    {
        svg,
        penta,
        startMillis,
        duration,
        pentaStyle,
    }: PentaAnimationConfig
): DrawingLineAnimation {

    const animation = new DrawingLineAnimationBuilder({
        svg,
        startMillis,
        duration
    })
        .setPaintStyle(pentaStyle.centralLine)
        .addLines(
            new Line(penta.pubis, penta.neck)
        )

        .setStartMillis(startMillis + duration)
        .setDuration(duration / 2)
        .setPaintStyle(pentaStyle.pentagramLine)
        .addLines([
            new Line(penta.neck, penta.head),
            new Line(penta.neck, penta.shoulderLeft),
            new Line(penta.neck, penta.shoulderRight),
        ])
        .setStartMillis(startMillis + duration * 1.5)
        .setDuration(duration)
        .addLines([
            new Line(penta.shoulderLeft, penta.elbowLeft),
            new Line(penta.shoulderRight, penta.elbowRight),
            new Line(penta.head, penta.shoulderLeft),
            new Line(penta.head, penta.shoulderRight),
        ], [
            new Line(penta.shoulderRight, penta.pubis),
            new Line(penta.shoulderLeft, penta.pubis),
        ], [
            new Line(penta.pubis, penta.kneeLeft),
            new Line(penta.pubis, penta.kneeRight),
            new Line(penta.hipLeft, penta.kneeLeft),
            new Line(penta.hipRight, penta.kneeRight),
        ])
        .setStartMillis(startMillis + duration * 1.5,)
        .setPaintStyle(pentaStyle.centralLine)
        .addLines(
            new Line(penta.head, penta.overhead),
            [
                new Line(penta.elbowLeft, penta.handLeft),
                new Line(penta.elbowRight, penta.handRight)
            ],
            [
                new Line(penta.kneeLeft, penta.footLeft),
                new Line(penta.kneeRight, penta.footRight)
            ]
        )
        .setStartMillis(startMillis + duration * 2.5)
        .setDuration(duration / 3)
        .addLines([
            new Line(penta.elbowLeft, penta.scapulaLeft),
            new Line(penta.elbowRight, penta.scapulaRight)
        ], [
            new Line(penta.scapulaLeft, penta.middle),
            new Line(penta.scapulaRight, penta.middle),
        ], [
            new Line(penta.middle, penta.hipRight),
            new Line(penta.middle, penta.hipLeft),
        ])
        .setStartMillis(startMillis + duration * 4.5)
        .addLines([
            new Line(penta.kneeLeft, penta.ischiumLeft),
            new Line(penta.kneeRight, penta.ischiumRight),
        ], [
            new Line(penta.ischiumLeft, penta.middle),
            new Line(penta.ischiumRight, penta.middle),
        ], [
            new Line(penta.middle, penta.shoulderRight),
            new Line(penta.middle, penta.shoulderLeft),
        ])
        .build()

    animation.applyStyle(pentaStyle.centralLine, 1)

    return animation
}
