import { SVG, SVGShape } from "../../../svg";
import { AnimationSection } from "../../AnimationSection"

export class SVGShapeAnimationSection extends AnimationSection {

    readonly shape: SVGShape

    constructor(
        svg: SVG,
        shape: SVGShape,
        startMillis: number,
        endMillis?: number,
        insertBefore?: SVGShape
    ) {
        super(startMillis, endMillis || startMillis)

        this.shape = shape

        svg.insertBefore(insertBefore, shape)

        this.renderFn = function (time: number) {
            const show = this.startMillis === this.endMillis
                ? this.hasStarted(time)
                : this.isRunning(time)

            if (show) {
                this.shape.element.style.opacity = "1"
            } else {
                this.shape.element.style.opacity = "0"
            }
        }
    }
}