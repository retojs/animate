import { PaintStyle } from "comicvm-dom";
import { SVG, SVG_NAMESPACE } from "./SVG";
import { SVGShape } from "./SVGShape";

export class SVGRect extends SVGShape {

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        style: PaintStyle,
        svg?: SVG
    ) {
        super(style, svg);

        this.element = document.createElementNS(SVG_NAMESPACE, "rect")
        this.element.setAttributeNS(null, "x", x.toString())
        this.element.setAttributeNS(null, "y", y.toString())
        this.element.setAttributeNS(null, "width", width.toString())
        this.element.setAttributeNS(null, "height", height.toString())

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

    get width() {
        return parseFloat(this.element.getAttribute("width"));
    }

    set width(width: number) {
        this.element.setAttributeNS(null, "width", width.toString())
    }

    get height() {
        return parseFloat(this.element.getAttribute("height"));
    }

    set height(height: number) {
        this.element.setAttributeNS(null, "height", height.toString())
    }
}