import { PaintStyle } from "comicvm-dom";
import { SVG, SVG_NAMESPACE } from "./SVG";
import { SVGShape } from "./SVGShape";
import { Line, Point } from "comicvm-geometry-2d";

export class SVGLine extends SVGShape {

    static fromLine(line: Line, style: PaintStyle, svg?: SVG): SVGLine {
        return new SVGLine(line.from.x, line.from.y, line.to.x, line.to.y, style, svg)
    }

    static fromPoints(from: Point, to: Point, style: PaintStyle, svg?: SVG): SVGLine {
        return new SVGLine(from.x, from.y, to.x, to.y, style, svg)
    }

    constructor(x1: number, y1: number, x2: number, y2: number, style: PaintStyle, svg?: SVG) {
        super(style, svg);

        this.element = document.createElementNS(SVG_NAMESPACE, 'line')
        this.element.setAttributeNS(null, 'x1', x1.toString())
        this.element.setAttributeNS(null, 'y1', y1.toString())
        this.element.setAttributeNS(null, 'x2', x2.toString())
        this.element.setAttributeNS(null, 'y2', y2.toString())

        this.applyPaintStyle()

        if (svg) svg.add(this)
    }

    get x1() {
        return parseFloat(this.element.getAttribute("x1"));
    }

    set x1(x: number) {
        this.element.setAttributeNS(null, "x1", x.toString())
    }

    get y1() {
        return parseFloat(this.element.getAttribute("y1"));
    }

    set y1(y: number) {
        this.element.setAttributeNS(null, "y1", y.toString())
    }

    get x2() {
        return parseFloat(this.element.getAttribute("x2"));
    }

    set x2(x: number) {
        this.element.setAttributeNS(null, "x2", x.toString())
    }

    get y2() {
        return parseFloat(this.element.getAttribute("y2"));
    }

    set y2(y: number) {
        this.element.setAttributeNS(null, "y2", y.toString())
    }

    get length(): number {
        const a = this.x1 - this.x2
        const b = this.y1 - this.y2
        return Math.sqrt(a * a + b * b)
    }

    clone() {
        return new SVGLine(this.x1, this.y1, this.x2, this.y2, this.style, this.svg)
    }
}