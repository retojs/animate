import { Line, Point } from "comicvm-geometry-2d";
import { PaintStyle } from "comicvm-dom";
import { Animation, SVGShapeAnimationSection } from "../index";
import { SVG, SVGCircle, SVGLine, SVGShape } from "../../svg";

export interface SVGShapeAnimationFactoryConfig {
    svg?: SVG,
    animation?: Animation,
    style?: PaintStyle,
    radius?: number
}

export const defaultConfig = {
    radius: 5
}

export class SVGShapeAnimationFactory {

    insertBeforeRef: SVGShape

    constructor(
        public svg: SVG,
        public animation: Animation,
        public style: PaintStyle,
        public radius: number = 5
    ) {
    }

    addDot(
        point: Point,
        startMillis: number = 0,
        endMillis: number = 0,
        config: SVGShapeAnimationFactoryConfig = defaultConfig
    ) {
        this.animation.add(new SVGShapeAnimationSection(
            this.svg,
            new SVGCircle(point.x, point.y, config.radius || this.radius, config.style || this.style, this.svg),
            startMillis,
            endMillis,
            this.insertBeforeRef
        ))
    }

    addLine(
        line: Line,
        startMillis: number = 0,
        endMillis: number = 0,
        style?: PaintStyle,
    ) {
        this.animation.add(new SVGShapeAnimationSection(
            this.svg,
            SVGLine.fromLine(line, style || this.style, this.svg),
            startMillis,
            endMillis,
            this.insertBeforeRef
        ))
    }
}

