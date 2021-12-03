import { ShapeAnimationConfig } from "../ShapeAnimationConfig";
import { SVGShapeAnimationSection } from "../SVGShapeAnimationSection";
import { PaintStyle } from "comicvm-dom";
import { Animation } from "../../Animation";

const defaultConfig = {
    style: PaintStyle.fillAndStroke("transparent", "rgba(0,0,0,0.9)", 2),
    startMillis: 0,
    duration: 1000,
    progressFn: (time: number) => time,
}

export class ShapeAnimationFactory {

    animation: Animation;

    config: ShapeAnimationConfig<any>;

    constructor(
        config: ShapeAnimationConfig<any> = {}
    ) {
        this.animation = new Animation()

        this.config = {...defaultConfig, ...config}
    }

    validateShapeAnimationConfig(config: ShapeAnimationConfig<any>): ShapeAnimationConfig<any> {
        if (!config.shape) {
            throw new Error("SVGShapeConfigurationConfig must provide an SVGShape")
        }

        return {
            ...this.config,
            ...config,
        }
    }

    createSection(config: ShapeAnimationConfig<any>) {
        config = this.validateShapeAnimationConfig(config)

        const section = new SVGShapeAnimationSection(
            config.shape,
            config.startMillis,
            config.duration > 0
                ? config.startMillis + config.duration
                : 0,
            config.visibleFrom,
            config.visibleUntil,
        )

        return section
    }

    addShowShape(
        config: ShapeAnimationConfig<any> = this.config,
    ) {
        if (!this.config.parent) return

        this.config.parent.add(this.createSection(config))
    }

    applyShowShape(
        section: SVGShapeAnimationSection<any>,
        targetStyle: PaintStyle,
        config: ShapeAnimationConfig<any> = {},
    ) {
        return this.createSection({
            ...config,
            shape: section.shape,
        })
    }
}