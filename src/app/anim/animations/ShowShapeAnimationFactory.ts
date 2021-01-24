import { Line, Point } from "comicvm-geometry-2d";
import { PaintStyle } from "comicvm-dom";
import { Animation, ShowShapeAnimationSection } from "../index";
import { SVG, SVGCircle, SVGLine, SVGShape } from "../../svg";

export interface ShowShapeAnimationFactoryConfig {
    svg?: SVG,
    animation?: Animation,
    style?: PaintStyle,
    radius?: number
}

export const defaultConfig = {
    radius: 5
}

export class ShowShapeAnimationFactory {

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
        config?: ShowShapeAnimationFactoryConfig
    ): ShowShapeAnimationSection {
        const animationSection = new ShowShapeAnimationSection(
            this.svg,
            new SVGCircle(
                point.x,
                point.y,
                (config && config.radius) || this.radius,
                (config && config.style) || this.style,
                this.svg
            ),
            startMillis,
            endMillis,
            this.insertBeforeRef
        )
        this.animation.add(animationSection)

        return animationSection
    }

    addLine(
        line: Line,
        startMillis: number = 0,
        endMillis: number = 0,
        style?: PaintStyle,
    ): ShowShapeAnimationSection {
        const animationSection = new ShowShapeAnimationSection(
            this.svg,
            SVGLine.fromLine(line, style || this.style, this.svg),
            startMillis,
            endMillis,
            this.insertBeforeRef
        )
        this.animation.add(animationSection)

        return animationSection
    }
}

