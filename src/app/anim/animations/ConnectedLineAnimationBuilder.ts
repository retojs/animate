import { PaintStyle } from "comicvm-dom";
import { Line, Point } from "comicvm-geometry-2d";
import { DEFAULT_STYLE } from "../../style";
import { SVG, SVGLine } from "../../svg";
import { Animation } from "../";
import { ConnectedLineAnimation } from "./ConnectedLineAnimation";

export interface ConnectedLineAnimationConfig {
    svg: SVG;
    startMillis: number;
    defaultDuration: number,
    gapWidth: number,
    lineStyle: PaintStyle,
    connectionStyle: PaintStyle
}

export const DEFAULT_CONNECTED_LINE_ANIMATION_CONFIG = {
    startMillis: 0,
    defaultDuration: 300,
    gapWidth: 10,
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
    ) {
        this.animation.add(new ConnectedLineAnimation({
            ...this.config,
            line: SVGLine.fromPoints(from, to, this.config.lineStyle, this.config.svg),
            connectedLine: new Line(connectedFrom, connectedTo)
        }))
    }

    addLines(...linePoints: [Point, Point, Point, Point][]) {
        linePoints.forEach(points => {
            const [from, to, connectedFrom, connectedTo] = points
            this.addLine(from, to, connectedFrom, connectedTo)
        })
    }
}

