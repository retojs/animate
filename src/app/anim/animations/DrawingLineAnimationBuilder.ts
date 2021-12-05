import { Line } from "comicvm-geometry-2d";
import { PaintStyle } from "comicvm-dom";
import { SVG, SVGLine } from "../../svg";
import { DrawingLineAnimation } from "./DrawingLineAnimation";
import { DrawingLineAnimationSection } from "./DrawingLineAnimationSection";

export interface DrawingLineAnimationConfig {
    svg: SVG,
    startMillis: number,
    defaultDuration?: number,
    defaultPaintStyle?: PaintStyle,
}

export class DrawingLineAnimationBuilder {

    private animation: DrawingLineAnimation

    constructor(
        public config: DrawingLineAnimationConfig
    ) {
        this.animation = new DrawingLineAnimation(
            config.svg,
            config.startMillis,
            config.defaultDuration,
            config.defaultPaintStyle
        )
    }

    fromLines(...lines: (Line | Line[])[]): DrawingLineAnimationBuilder {

        const {svg, startMillis, defaultDuration, defaultPaintStyle} = this.config;

        const sections: DrawingLineAnimationSection[] = lines.map((lineGroup, index) => {
            const lineArray = Array.isArray(lineGroup) ? lineGroup : [lineGroup]
            return lineArray.map(line => new DrawingLineAnimationSection(
                SVGLine.fromLine(line, defaultPaintStyle, svg),
                startMillis + index * defaultDuration,
                startMillis + index * defaultDuration + defaultDuration
            ))
        }).reduce((flat, arr) => flat.concat(arr), [])

        this.animation.add(...sections);

        return this;
    }

    setStartMillis(startMillis): DrawingLineAnimationBuilder {
        this.config.startMillis = startMillis
        return this
    }

    setDefaultDuration(defaultDuration): DrawingLineAnimationBuilder {
        this.config.defaultDuration = defaultDuration
        return this
    }

    setDefaultPaintStyle(defaultPaintStyle: PaintStyle): DrawingLineAnimationBuilder {
        this.config.defaultPaintStyle = defaultPaintStyle
        return this
    }

    build(): DrawingLineAnimation {
        return this.animation
    }
}
