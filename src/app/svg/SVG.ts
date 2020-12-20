import { DomElement, DomElementContainer } from "comicvm-dom"
import { SVGShape } from "./SVGShape";

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

    remove(...svgShape: SVGShape[]) {
        (svgShape || []).forEach(shape =>
            this.svgElement.removeChild(shape.element)
        )
    }

    removeAll() {
        const childNodes = Array.from(this.svgElement.childNodes)
        childNodes.forEach(childNode =>
            this.svgElement.removeChild(childNode)
        )
    }
}
