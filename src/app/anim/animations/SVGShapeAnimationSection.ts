import { SVGShape } from "../../svg";
import { AnimationSection } from "../AnimationSection";
import { ShapeAnimationConfig } from "./ShapeAnimationConfig";

export class SVGShapeAnimationSection<T extends SVGShape> extends AnimationSection {

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

    clone(config: ShapeAnimationConfig<any>) {
        return new SVGShapeAnimationSection(
            config.shape || this.shape,
            config.startMillis || this.startMillis,
            config.duration || this.duration
        )
    }
}