import { SVG, SVGShape } from "../../../svg";
import { AnimationSection } from "../../AnimationSection"

export class SVGShapeAnimationSection extends AnimationSection {

    readonly shape: SVGShape

    /**
     * @param svg
     * @param shape
     * @param startMillis
     * @param endMillis - if endMillis is 0 the animation will not terminate
     * @param insertBefore
     */
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
            const show = this.endMillis === 0
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