import { Line, Point } from "comicvm-geometry-2d";
import { PaintStyle } from "comicvm-dom";
import { Animation, SVGShapeAnimationSection } from "../index";
import { SVG, SVGCircle, SVGLine, SVGShape } from "../../svg";

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
        endMillis?: number,
    ) {
        this.animation.add(new SVGShapeAnimationSection(
            this.svg,
            new SVGCircle(point.x, point.y, this.radius, this.style, this.svg),
            startMillis,
            endMillis,
            this.insertBeforeRef
        ))
    }

    addLine(
        line: Line,
        startMillis: number = 0,
        endMillis?: number,
    ) {
        this.animation.add(new SVGShapeAnimationSection(
            this.svg,
            SVGLine.fromLine(line, this.style, this.svg),
            startMillis,
            endMillis,
            this.insertBeforeRef
        ))
    }
}

