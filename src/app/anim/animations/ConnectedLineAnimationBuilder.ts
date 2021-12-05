import { Animation } from "../index";
import { SVG, SVGLine } from "../../svg";
import { PaintStyle } from "comicvm-dom";
import { Line, Point } from "comicvm-geometry-2d";
import { ConnectedLineAnimation } from "./ConnectedLineAnimation";
import { DEFAULT_STYLE } from "../../style";

export interface ConnectedLineAnimationConfig {
     svg: SVG;
     startMillis: number;
     defaultDuration : number,
     connectionGaps: number,
     lineStyle: PaintStyle,
     connectionStyle: PaintStyle
}

export const DEFAULT_CONNECTED_LINE_ANIMATION_CONFIG = {
    startMillis:0,
    defaultDuration: 300,
    connectionGaps: 10,
    lineStyle: DEFAULT_STYLE,
    connectionStyle: DEFAULT_STYLE
}

export class ConnectedLineAnimationBuilder {

    animation: Animation

    constructor(
        public config: ConnectedLineAnimationConfig
    ) {
        this.animation = new Animation()
        this.config = {...DEFAULT_CONNECTED_LINE_ANIMATION_CONFIG, ...config}
    }

    addLine(
        from: Point,
        to: Point,
        connectedFrom: Point,
        connectedTo: Point,
        connectionGaps = this.config.connectionGaps,
        startMillis?: number
    ) {
        let start = startMillis
        if (start == undefined) {
            start = this.animation.lastSection
                ? this.animation.lastSection.endMillis
                : this.config.startMillis
        }

        this.animation.add(new ConnectedLineAnimation(
            this.config.svg,
            SVGLine.fromPoints(from, to, this.config.lineStyle, this.config.svg),
            new Line(connectedFrom, connectedTo),
            connectionGaps,
            start,
            this.config.defaultDuration,
            this.config.connectionStyle
        ))
    }

    addLines(...linePoints: [Point, Point, Point, Point][]) {
        const start = this.animation.lastSection
            ? this.animation.lastSection.endMillis
            : this.config.startMillis

        linePoints.forEach(points => {
            const [from, to, connectedFrom, connectedTo] = points
            this.addLine(from, to, connectedFrom, connectedTo, this.config.connectionGaps, start)
        })
    }
}

