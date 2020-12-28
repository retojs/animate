import { SVG, SVG_NAMESPACE } from "./SVG";
import { SVGShape } from "./SVGShape";
import { Rectangle } from "comicvm-geometry-2d";

export class SVGImage extends SVGShape {

    static fromRect(
        href: string,
        r: Rectangle,
        svg?: SVG
    ) {
        return new SVGImage(href, r.x, r.y, r.width, r.height, svg)
    }

    constructor(
        href: string,
        x: number,
        y: number,
        width: number,
        height: number,
        svg?: SVG
    ) {
        super(null, svg);

        this.element = document.createElementNS(SVG_NAMESPACE, "image")
        this.element.setAttributeNS(null, "href", href)
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