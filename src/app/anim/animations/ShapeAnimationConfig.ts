import { PaintStyle } from "comicvm-dom";
import { SVG, SVGShape } from "../../svg";
import { Animation } from "../Animation";

export interface ShapeAnimationConfig<T extends SVGShape> {
    parent?: Animation
    svg?: SVG
    shape?: T
    style?: PaintStyle
    startMillis?: number
    duration?: number
    visibleFrom?: number
    visibleUntil?: number
    progressFn?: (time: number) => number
}
