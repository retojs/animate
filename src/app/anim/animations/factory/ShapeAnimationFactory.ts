import { PaintStyle } from "comicvm-dom";
import { SVG, SVGShape } from "../../../svg";
import { Animation } from "../../Animation";
import { ShapeAnimationSection } from "../ShapeAnimationSection";

export interface ShapeAnimationSectionConfig<T extends SVGShape> {
    parent?: Animation
    svg?: SVG
    shape?: T
    style?: PaintStyle
    startMillis?: number
    duration?: number
    visibleFrom?: number
    visibleUntil?: number
    progressFn?: (time: number) => number
    insertBeforeShape?: SVGShape
}

const DEFAULT_SHAPE_ANIMATION_CONFIG = {
    style: PaintStyle.fillAndStroke("transparent", "rgba(0,0,0,0.9)", 2),
    startMillis: 0,
    duration: 1000,
    progressFn: (time: number) => time,
}

export class ShapeAnimationFactory {

    animation: Animation;

    constructor(
        public  config: ShapeAnimationSectionConfig<any> = {}
    ) {
        this.animation = new Animation()
        this.config = {...DEFAULT_SHAPE_ANIMATION_CONFIG, ...config}
    }

    getAnimationConfig(config: ShapeAnimationSectionConfig<any>): ShapeAnimationSectionConfig<any> {
        if (!config.shape) {
            throw new Error("SVGShapeConfigurationConfig must provide an SVGShape")
        }

        return {
            ...this.config,
            ...config,
        }
    }

    createShape(config: ShapeAnimationSectionConfig<any>): ShapeAnimationSection<any> {
        config = this.getAnimationConfig(config)

        const section = ShapeAnimationSection.create(config)

        if (config.insertBeforeShape) {
            config.svg.insertBefore(config.insertBeforeShape, config.shape);
        }

        return section
    }

    addShape(
        config: ShapeAnimationSectionConfig<any> = this.config,
    ) {
        if (!this.config.parent) return

        this.config.parent.add(this.createShape(config))
    }

    applyShape(
        section: ShapeAnimationSection<any>,
        targetStyle: PaintStyle,
        config: ShapeAnimationSectionConfig<any> = {},
    ): ShapeAnimationSection<any> {
        return this.createShape({
            ...config,
            shape: section.shape,
        })
    }
}