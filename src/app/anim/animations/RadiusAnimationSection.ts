import { SVGCircle } from "../../svg";
import { ShapeAnimationSectionConfig } from "./factory/ShapeAnimationFactory";
import { ShapeAnimationSection } from "./ShapeAnimationSection";

export class RadiusAnimationSection extends ShapeAnimationSection<SVGCircle> {

    readonly radius: number;

    constructor(
        private circle: SVGCircle,
        config: ShapeAnimationSectionConfig<any>,
    ) {
        super(
            circle,
            config.startMillis,
            config.startMillis + config.duration,
            config.visibleFrom,
            config.visibleUntil
        )

        this.radius = this.circle.radius
    }

    static getBounce(
        circle: SVGCircle,
        frequency: number,
        config: ShapeAnimationSectionConfig<any>,
    ): RadiusAnimationSection {
        const section = new RadiusAnimationSection(circle, config)

        section.renderFn = function (time: number) {
            const progress = this.getProgressMillis(time)
            section.circle.radius = section.radius * Math.abs(Math.sin(progress / frequency * 2 * Math.PI))
        }

        return section
    }


    static getLinear(
        circle: SVGCircle,
        targetRadius: number,
        config: ShapeAnimationSectionConfig<any>,
    ): RadiusAnimationSection {
        const section = new RadiusAnimationSection(circle, config)

        section.renderFn = function (time: number) {
            const progress = this.getProgress(time)
            section.circle.radius = section.radius + (targetRadius - section.radius) * progress
        }

        return section
    }

    static getPulse(
        circle: SVGCircle,
        angle: number = 2 * Math.PI,
        config: ShapeAnimationSectionConfig<any>,
    ): RadiusAnimationSection {
        const section = new RadiusAnimationSection(circle, config)

        section.renderFn = function (time: number) {
            const progress = this.getProgress(time)
            const _angle = (progress) * angle
            section.circle.radius = section.radius * Math.sin(_angle)
        }

        return section
    }

    remove() {
        this.circle.svg.remove(this.circle)
    }
}