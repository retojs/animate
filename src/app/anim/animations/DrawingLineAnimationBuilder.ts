import { Line } from "comicvm-geometry-2d";
import { PaintStyle } from "comicvm-dom";
import { SVG, SVGLine } from "../../svg";
import { DrawingLineAnimation } from "./DrawingLineAnimation";
import { DrawingLineAnimationSection } from "./DrawingLineAnimationSection";

export interface DrawingLineAnimationConfig {
    svg: SVG,
    startMillis: number,
    duration?: number,
    style?: PaintStyle,
}

export class DrawingLineAnimationBuilder {

    private animation: DrawingLineAnimation

    constructor(
        public config: DrawingLineAnimationConfig
    ) {
        this.animation = new DrawingLineAnimation(
            config.svg,
            config.startMillis,
            config.duration,
            config.style
        )
    }

    addLines(...lines: (Line | Line[])[]): DrawingLineAnimationBuilder {

        const {svg, startMillis, duration, style} = this.config;

        const sections: DrawingLineAnimationSection[] = lines.map((lineGroup, index) => {
            const lineArray = Array.isArray(lineGroup) ? lineGroup : [lineGroup]
            return lineArray.map(line => new DrawingLineAnimationSection(
                SVGLine.fromLine(line, style, svg),
                startMillis + index * duration,
                startMillis + index * duration + duration
            ))
        }).reduce((flat, arr) => flat.concat(arr), [])

        this.animation.add(...sections);

        return this;
    }

    setStartMillis(startMillis): DrawingLineAnimationBuilder {
        this.config.startMillis = startMillis
        return this
    }

    setDuration(duration): DrawingLineAnimationBuilder {
        this.config.duration = duration
        return this
    }

    setPaintStyle(style: PaintStyle): DrawingLineAnimationBuilder {
        this.config.style = style
        return this
    }

    build(): DrawingLineAnimation {
        return this.animation
    }
}
