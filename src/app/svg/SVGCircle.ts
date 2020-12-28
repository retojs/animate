import { PaintStyle } from "comicvm-dom";
import { SVG, SVG_NAMESPACE } from "./SVG";
import { SVGShape } from "./SVGShape";
import { Point } from "comicvm-geometry-2d";

export class SVGCircle extends SVGShape {

    static create(center: Point, radius: number, style: PaintStyle) {
        return new SVGCircle(center.x, center.y, radius, style)
    }

    constructor(x: number, y: number, r: number, style: PaintStyle, svg?: SVG) {
        super(style, svg);

        this.element = document.createElementNS(SVG_NAMESPACE, "circle")
        this.element.setAttributeNS(null, "cx", x.toString())
        this.element.setAttributeNS(null, "cy", y.toString())
        this.element.setAttributeNS(null, "r", r.toString())

        this.applyPaintStyle()

        if (svg) svg.add(this)
    }

    get x() {
        return parseFloat(this.element.getAttribute("x"));
    }

    set x(x: number) {
        this.element.setAttributeNS(null, "x", x.toString())
    }

    get y() {
        return parseFloat(this.element.getAttribute("y"));
    }

    set y(y: number) {
        this.element.setAttributeNS(null, "y", y.toString())
    }

    get radius() {
        return parseFloat(this.element.getAttribute("r"));
    }

    set radius(radius: number) {
        this.element.setAttributeNS(null, "r", radius.toString())
    }
}