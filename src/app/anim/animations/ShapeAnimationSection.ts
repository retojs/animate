import { SVGShape } from "../../svg";
import { AnimationSection } from "../AnimationSection";
import { ShapeAnimationSectionConfig } from "./factory/ShapeAnimationFactory";

export class ShapeAnimationSection<T extends SVGShape> extends AnimationSection {

    static create(config: ShapeAnimationSectionConfig<any>) {
        return new ShapeAnimationSection(
            config.shape,
            config.startMillis,
            config.duration > 0
                ? config.startMillis + config.duration
                : 0,
            config.visibleFrom,
            config.visibleUntil,
        )
    }

    constructor(
        public shape: T,
        public startMillis: number,
        public endMillis: number,
        public visibleFrom: number = startMillis,
        public visibleUntil: number = endMillis,
    ) {
        super(startMillis, endMillis, visibleFrom, visibleUntil)
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
        return new ShapeAnimationSection(
            config.shape || this.shape,
            config.startMillis || this.startMillis,
            config.duration || this.duration
        )
    }
}