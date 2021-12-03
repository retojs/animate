import { PaintStyle } from "comicvm-dom";
import { SVG, SVG_NAMESPACE } from "./SVG";
import { SVGShape } from "./SVGShape";
import { Point } from "comicvm-geometry-2d";

export class SVGText extends SVGShape {

    static fromPoint(point: Point, text: string, rotate?: number, style?: PaintStyle, svg?: SVG): SVGText {
        return new SVGText(point.x, point.y, text, rotate, style, svg)
    }

    static create(center: Point, text: string, rotate?: number, style?: PaintStyle, svg?: SVG) {
        return new SVGText(center.x, center.y, text, rotate, style, svg)
    }

    constructor(x: number, y: number, text: string, rotate?: number, style?: PaintStyle, svg?: SVG) {
        super(style, svg);

        this.element = document.createElementNS(SVG_NAMESPACE, "text")
        this.element.setAttributeNS(null, "x", x.toString())
        this.element.setAttributeNS(null, "y", y.toString())
        this.element.setAttributeNS(null, "rotate", rotate.toString())
        this.element.innerHTML = text

        this.applyPaintStyle()
        this.css = "text-align: center"

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

    get rotate() {
        return parseFloat(this.element.getAttribute("rotate"));
    }

    set rotate(rotate: number) {
        this.element.setAttributeNS(null, "rotate", rotate.toString())
    }

    get text() {
        return this.element.innerHTML.trim();
    }

    set text(text: string) {
        this.element.innerHTML = text
    }

    clone(): SVGText {
        return new SVGText(
            this.x,
            this.y,
            this.text,
            this.rotate,
            this.style,
            this.svg
        )
    }
}