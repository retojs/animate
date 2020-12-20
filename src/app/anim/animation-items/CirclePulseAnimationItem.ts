import { AnimationItem } from "../AnimationItem"
import { SVGCircle } from "../../svg";

export const PULSE_INTERVAL = 3000

export class CirclePulseAnimationItem extends AnimationItem {

    readonly r: number;

    constructor(
        private circle: SVGCircle,
        public startMillis: number,
        public endMillis: number,
    ) {
        super(startMillis, endMillis)

        this.r = this.circle.radius
    }

    render(t: number) {
        const progress = this.getProgressMillis(t)
        this.circle.radius = this.r * Math.abs(Math.sin(progress / PULSE_INTERVAL * 2 * Math.PI))
    }
}