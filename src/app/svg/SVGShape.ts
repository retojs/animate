import { PaintStyle } from "comicvm-dom";
import { SVG } from "./SVG";

export class SVGShape {

    element: SVGElement
    svg: SVG

    private _style: PaintStyle
    private _transform: string
    private _css: string

    constructor(style: PaintStyle, svg?: SVG, transform?: string, css?: string) {
        this._style = style;
        this._transform = transform
        this._css = css
        this.svg = svg
    }

    get style(): PaintStyle {
        return this._style
    }

    set style(style: PaintStyle) {
        this._style = style
        this.applyPaintStyle()
    }

    get transform(): string {
        return this._transform
    }

    set transform(transform: string) {
        this._transform = transform
        this.applyTransform()
    }

    get css(): string {
        return this._css
    }

    set css(css: string) {
        this._css = css
        this.applyCSS()
    }

    applyPaintStyle() {
        if (!this.style) return

        this.element.setAttributeNS(null, 'shape-rendering', 'geometricPrecision')
        if (this.style.fillStyle) {
            this.element.setAttributeNS(null, 'fill', this.style.fillStyle as string)
        }
        if (this.style.strokeStyle) {
            this.element.setAttributeNS(null, 'stroke', this.style.strokeStyle as string)
        }
        if (this.style.lineWidth) {
            this.element.setAttributeNS(null, 'stroke-width', this.style.lineWidth.toString())
        }
    }

    applyTransform() {
        if (!this.transform) return

        this.element.setAttributeNS(null, 'transform', this.transform)
    }

    applyCSS() {
        if (!this.css) return

        this.element.setAttributeNS(null, 'style', this.css)
    }
}