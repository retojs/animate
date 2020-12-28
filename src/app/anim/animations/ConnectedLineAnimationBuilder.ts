import { Animation } from "../index";
import { SVG, SVGLine } from "../../svg";
import { PaintStyle } from "comicvm-dom";
import { Line, Point } from "comicvm-geometry-2d";
import { ConnectedLineAnimation } from "./ConnectedLineAnimation";

export class ConnectedLineAnimationBuilder {

    animation: Animation

    constructor(
        public svg: SVG,
        public startMillis = 0,
        public defaultDuration = 300,
        public connectionGaps: number = 10,
        public lineStyle: PaintStyle,
        public connectionStyle: PaintStyle
    ) {
        this.animation = new Animation()
    }

    addLine(
        from: Point,
        to: Point,
        connectedFrom: Point,
        connectedTo: Point,
        connectionGaps = this.connectionGaps,
        startMillis?: number
    ) {
        let start = startMillis
        if (start == undefined) {
            start = this.animation.lastSection
                ? this.animation.lastSection.endMillis
                : this.startMillis
        }

        this.animation.add(new ConnectedLineAnimation(
            this.svg,
            SVGLine.fromPoints(from, to, this.lineStyle, this.svg),
            new Line(connectedFrom, connectedTo),
            connectionGaps,
            start,
            this.defaultDuration,
            this.connectionStyle
        ))
    }

    addLines(...linePoints: [Point, Point, Point, Point][]) {
        const start = this.animation.lastSection
            ? this.animation.lastSection.endMillis
            : this.startMillis

        linePoints.forEach(points => {
            const [from, to, connectedFrom, connectedTo] = points
            this.addLine(from, to, connectedFrom, connectedTo, this.connectionGaps, start)
        })
    }
}

