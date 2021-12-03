import { PaintStyle } from "comicvm-dom";
import { SVG, SVG_NAMESPACE } from "./SVG";
import { SVGShape } from "./SVGShape";
import { Circle, Point } from "comicvm-geometry-2d";

export interface CircleConfig {
    x?: number,
    y?: number,
    radius?: number,
    style?: PaintStyle
}

export class SVGCircle extends SVGShape {

    static fromCircle(circle: Circle, style?: PaintStyle, svg?: SVG): SVGCircle {
        return new SVGCircle(circle.x, circle.y, circle.radius, style, svg)
    }

    static fromPoint(point: Point, radius: number, style?: PaintStyle, svg?: SVG): SVGCircle {
        return new SVGCircle(point.x, point.y, radius, style, svg)
    }

    constructor(x: number, y: number, r: number, style?: PaintStyle, svg?: SVG) {
        super(style, svg);

        this.element = document.createElementNS(SVG_NAMESPACE, "circle")
        this.element.setAttributeNS(null, "cx", x.toString())
        this.element.setAttributeNS(null, "cy", y.toString())
        this.element.setAttributeNS(null, "r", r.toString())

        this.applyPaintStyle()

        if (svg) svg.add(this)
    }

    get x() {
        return parseFloat(this.element.getAttribute("cx"));
    }

    set x(x: number) {
        this.element.setAttributeNS(null, "cx", x.toString())
    }

    get y() {
        return parseFloat(this.element.getAttribute("cy"));
    }

    set y(y: number) {
        this.element.setAttributeNS(null, "cy", y.toString())
    }

    get radius() {
        return parseFloat(this.element.getAttribute("r"));
    }

    set radius(radius: number) {
        this.element.setAttributeNS(null, "r", radius.toString())
    }

    clone(): SVGCircle{
        return new SVGCircle(
            this.x,
            this.y,
            this.radius,
            this.style,
            this.svg,
        )
    }

    evolve(config?: CircleConfig): SVGCircle {
        const circle = new SVGCircle(
            this.x,
            this.y,
            this.radius,
            this.style,
            this.svg
        )
        circle.x = (config && config.x) || circle.x
        circle.y = (config && config.y) || circle.y
        circle.radius = (config && config.radius) || circle.radius
        circle.style = (config && config.style) || circle.style

        return circle
    }
}