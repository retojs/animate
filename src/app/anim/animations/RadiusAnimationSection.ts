import { AnimationSection } from "../AnimationSection"
import { SVGCircle } from "../../svg";

export const PULSE_INTERVAL = 3000

export class RadiusAnimationSection extends AnimationSection {

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

    static getLinearAnimation(
        circle: SVGCircle,
        targetRadius: number,
        startMillis: number,
        duration: number,
    ): RadiusAnimationSection {
        const section = new RadiusAnimationSection(circle, startMillis, startMillis + duration)

        section.renderFn = function (time: number) {
            const progress = this.getProgress(time)
            section.circle.radius = section.r + (targetRadius - section.r) * progress
        }

        return section
    }

    static getSinglePulse(
        circle: SVGCircle,
        targetRadius: number,
        startMillis: number,
        duration: number,
    ): RadiusAnimationSection {
        const section = new RadiusAnimationSection(circle, startMillis, startMillis + duration)

        section.renderFn = function (time: number) {
            const progress = this.getProgress(time)
            const angle = (progress) * 2 * Math.PI
            section.circle.radius = targetRadius + (section.r - targetRadius) * Math.sin(angle)
        }

        return section
    }

    remove() {
        this.circle.svg.remove(this.circle)
    }
}