import { AnimationSection } from "../AnimationSection";
import { SVG, SVGCircle, SVGShape } from "../../svg";
import { movePoint } from "./movePoint";
import { getSinusValue } from "./getSinusValue";
import { PaintStyle } from "comicvm-dom";

export class MovingCircleAnimationSection extends AnimationSection {

    static fromCircles(
        svg,
        source: SVGCircle,
        target: SVGCircle,
        startMillis,
        interval,
        style?: PaintStyle,
    ): MovingCircleAnimationSection {
        return new MovingCircleAnimationSection(
            svg,
            source,
            target,
            startMillis,
            interval,
            style,
        )
    }

    readonly circle: SVGCircle

    /**
     *
     * @param svg
     * @param sourceCircle
     * @param targetCircle
     * @param startMillis
     * @param interval
     * @param style
     * @param insertBefore
     */
    constructor(
        svg: SVG,
        private sourceCircle: SVGCircle,
        private  targetCircle: SVGCircle,
        startMillis: number,
        interval: number,
        style?: PaintStyle,
        insertBefore?: SVGShape
    ) {
        super(startMillis, 0)

        this.circle = sourceCircle.clone()
        this.circle.style = style || this.circle.style

        svg.insertBefore(insertBefore, this.circle)

        this.renderFn = function (time: number) {
            const progress = getSinusValue(startMillis, time, interval)

            if (!this.circle || !this.sourceCircle || !this.targetCircle) return

            const p = movePoint(
                this.sourceCircle.x,
                this.sourceCircle.y,
                this.targetCircle.x,
                this.targetCircle.y,
                progress
            )

            this.circle.x = p.x
            this.circle.y = p.y
        }
    }

    remove() {
        this.circle.svg.remove(this.circle)
    }
}