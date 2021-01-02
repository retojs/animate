import { Line } from "comicvm-geometry-2d";
import { PaintStyle } from "comicvm-dom";
import { DrawingLineAnimation } from "../../anim";
import { Penta } from "../Penta";
import { PentaMan } from "../PentaMan";

export function createPentaLineAnimation(
    penta: Penta | PentaMan,
    svg,
    startMillis = 0,
    defaultDuration,
    pentagramStroke: PaintStyle,
    centralLineStroke: PaintStyle
): DrawingLineAnimation {

    const animation = DrawingLineAnimation.fromLines(
        svg,
        startMillis,
        defaultDuration,
        centralLineStroke,

        new Line(penta.pubis, penta.neck),
    )

    const fromHeadAndNeckToShoulders = DrawingLineAnimation.fromLines(svg,
        startMillis + defaultDuration,
        defaultDuration / 2,
        pentagramStroke,
        [
            new Line(penta.neck, penta.head),
            new Line(penta.neck, penta.shoulderLeft),
            new Line(penta.neck, penta.shoulderRight),
        ]
    )
    fromHeadAndNeckToShoulders.applyStyle(centralLineStroke, 0)
    animation.add(fromHeadAndNeckToShoulders)

    animation.add(DrawingLineAnimation.fromLines(svg,
        startMillis + defaultDuration * 1.5,
        defaultDuration,
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

    animation.add(DrawingLineAnimation.fromLines(svg,
        startMillis + defaultDuration * 1.5,
        defaultDuration,
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

    animation.add(DrawingLineAnimation.fromLines(svg,
        startMillis + defaultDuration * 2.5,
        defaultDuration / 3,
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

    animation.add(DrawingLineAnimation.fromLines(svg,
        startMillis + defaultDuration * 4.5,
        defaultDuration / 3,
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

    return animation
}
