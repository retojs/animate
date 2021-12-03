import { SVG, SVGShape } from "../../svg";
import { Animation } from "../Animation";
import { PaintStyle } from "comicvm-dom";
import { StyleAnimationSection } from "./StyleAnimationSection";

export class StyleAnimationFactory {

    constructor(
        public svg: SVG,
        public animation: Animation,
        public targetStyle?: PaintStyle,
        public defaultDuration?: number,
    ) {
    }

    addStyleAnimationSection(
        shape: SVGShape,
        startMillis: number = 0,
        duration: number = this.defaultDuration,
        targetStyle: PaintStyle = this.targetStyle
    ) {
        this.animation.add(new StyleAnimationSection(
            this.svg,
            shape,
            targetStyle,
            startMillis,
            startMillis + duration,
        ))
    }
}