import { DomElement, DomElementContainer, PaintStyle } from "comicvm-dom"
import { Circle, Line, Point } from "comicvm-geometry-2d";
import { SVGShape } from "./SVGShape";
import { SVGCircle } from "./SVGCircle";
import { SVGLine } from "./SVGLine";
import { SVGRect } from "./SVGRect";
import { SVGText } from "./SVGText";

export const SVG_NAMESPACE = "http://www.w3.org/2000/svg"

export const SVG_CONTAINER_STYLE_CLASS = "svg-canvas";

export interface SVGDomElementConfig {
    container?: DomElementContainer
    width?: number
    height?: number
}

export class SVG extends DomElement<HTMLDivElement> {

    htmlElement: HTMLDivElement
    svgElement: SVGElement

    width: number
    height: number

    public static create(config?: SVGDomElementConfig) {
        return config
            ? new SVG(config.container, config.width, config.height)
            : new SVG()
    }

    constructor(
        container?: DomElementContainer,
        width?: number,
        height?: number,
    ) {
        super(container)

        this.htmlElement = this.createDivElement()
        this.svgElement = this.createSVGElement()

        this.setDimensions(width, height)
    }

    protected createDivElement(): HTMLDivElement {
        const div = document.createElement("div")
        div.className = SVG_CONTAINER_STYLE_CLASS

        return this.appendToContainer(div)
    }

    createSVGElement(): SVGElement {
        const svg = document.createElementNS(SVG_NAMESPACE, "svg")
        svg.setAttributeNS(null, "width", "100%")
        svg.setAttributeNS(null, "height", "100%")
        this.htmlElement.appendChild(svg)

        return svg
    }

    setDimensions(width: number, height: number): SVG {
        this.width = width
        this.height = height
        this.htmlElement.style.width = width + "px"
        this.htmlElement.style.height = height + "px"

        return this
    }

    add(...svgShape: SVGShape[]) {
        (svgShape || []).forEach(shape =>
            this.svgElement.appendChild(shape.element)
        )
    }

    insertBefore(ref: SVGShape, ...svgShape: SVGShape[]) {
        if (!ref) {
            this.add(...svgShape)
        } else {
            (svgShape || []).forEach(shape =>
                this.svgElement.insertBefore(shape.element, ref.element)
            )
        }
    }

    remove(...svgShape: SVGShape[]) {
        (svgShape || []).forEach(shape => {
                if (this.svgElement.contains(shape.element)) {
                    this.svgElement.removeChild(shape.element)
                }
            }
        )
    }

    removeAll() {
        const childNodes = Array.from(this.svgElement.childNodes)
        childNodes.forEach(childNode =>
            this.svgElement.removeChild(childNode)
        )
    }

    newSVGCircle(circle: Circle, style?: PaintStyle): SVGCircle {
        return new SVGCircle(circle.x, circle.y, circle.radius, style, this)
    }

    newSVGCircleFromPoint(point: Point, radius: number, style?: PaintStyle): SVGCircle {
        return new SVGCircle(point.x, point.y, radius, style, this)
    }

    newSVGCircleFromCoords(x: number, y: number, r: number, style?: PaintStyle): SVGCircle {
        return new SVGCircle(x, y, r, style, this);
    }

    newSVGLine(line: Line, style: PaintStyle): SVGLine {
        return new SVGLine(line.from.x, line.from.y, line.to.x, line.to.y, style, this)
    }

    newSVGLineFromPoints(from: Point, to: Point, style: PaintStyle): SVGLine {
        return new SVGLine(from.x, from.y, to.x, to.y, style, this)
    }

    newSVGLineFromCoords(x1: number, y1: number, x2: number, y2: number, style: PaintStyle): SVGLine {
        return new SVGLine(x1, y1, x2, y2, style, this)
    }

    newSVGRect(x: number, y: number, width: number, height: number, style: PaintStyle): SVGRect {
        return new SVGRect(x, y, width, height, style, this);
    }

    newSVGText(point: Point, text: string, rotate?: number, style?: PaintStyle): SVGText {
        return new SVGText(point.x, point.y, text, rotate, style, this)
    }

    newSVGTextFromCoords(x: number, y: number, text: string, rotate?: number, style?: PaintStyle) {
        return new SVGText(x, y, text, rotate, style, this)
    }
}
