import { SVG, SVGShape } from "../../svg";
import { AnimationSection, AnimationSectionConfig } from "../AnimationSection";
import { Animation } from "../Animation";
import { PaintStyle } from "comicvm-dom";

export interface ShapeAnimationSectionConfig<T extends SVGShape> extends AnimationSectionConfig {
    parent?: Animation
    svg?: SVG
    shape?: T
    style?: PaintStyle
    insertBeforeShape?: SVGShape
}

export class ShapeAnimationSection<T extends SVGShape> extends AnimationSection {

    shape: SVGShape

    static create(config: ShapeAnimationSectionConfig<any>) {
        return new ShapeAnimationSection(config)
    }

    constructor(
        public config: ShapeAnimationSectionConfig<any>
    ) {
        super(config)

        this.shape = config.shape
    }

    applyVisibility(time: number) {
        if (this.isVisible(time)) {
            this.shape.element.style.opacity = "1"
        } else {
            this.shape.element.style.opacity = "0"
        }
    }

    render(time: number) {
        this.applyVisibility(time)
        if (this.isVisible(time)) {
            super.render(time)
        }
    }

    remove() {
        this.shape.svg.remove(this.shape)
    }

    clone(config: ShapeAnimationSectionConfig<any>) {
        return new ShapeAnimationSection(config)
    }
}