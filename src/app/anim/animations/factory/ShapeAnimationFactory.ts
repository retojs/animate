import { PaintStyle } from "comicvm-dom";
import { Animation } from "../../Animation";
import { ShapeAnimationSection, ShapeAnimationSectionConfig } from "../ShapeAnimationSection";

export class ShapeAnimationFactory {

    animation: Animation;

    constructor(
        public  config: ShapeAnimationSectionConfig<any> = {}
    ) {
        this.animation = new Animation()
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