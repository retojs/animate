import { SVG, SVGShape } from "../../svg";
import { AnimationItem } from "../AnimationItem"

export class SVGShapeAnimationItem extends AnimationItem {

    readonly shape: SVGShape

    /**
     *
     * @param svg
     * @param shape
     * @param startMillis
     * @param endMillis: if omitted the shape will stay visible after startMillis
     */
    constructor(
        svg: SVG,
        shape: SVGShape,
        startMillis: number,
        endMillis?: number,
    ) {
        super(startMillis, endMillis || startMillis)

        this.shape = shape
        svg.add(shape)
    }

    render(t: number) {
        const show = this.startMillis === this.endMillis
            ? this.hasStarted(t)
            : this.isRunning(t)

        if (show) {
            this.shape.element.style.opacity = "1"
        } else {
            this.shape.element.style.opacity = "0"
        }
    }
}