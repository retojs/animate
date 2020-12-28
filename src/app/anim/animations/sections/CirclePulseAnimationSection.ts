import { AnimationSection } from "../../AnimationSection"
import { SVGCircle } from "../../../svg";

export const PULSE_INTERVAL = 3000

export class CirclePulseAnimationSection extends AnimationSection {

    readonly r: number;

    constructor(
        private circle: SVGCircle,
        public startMillis: number,
        public endMillis: number,
    ) {
        super(startMillis, endMillis)

        this.r = this.circle.radius

        this.renderFn = function (time: number) {
            const progress = this.getProgressMillis(time)
            this.circle.radius = this.r * Math.abs(Math.sin(progress / PULSE_INTERVAL * 2 * Math.PI))
        }
    }
}