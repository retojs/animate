import { PaintStyle } from "comicvm-dom";

export class SVGShape {

    element: SVGElement

    private _style: PaintStyle

    constructor(style: PaintStyle) {
        this._style = style;
    }

    get style(): PaintStyle {
        return this._style
    }

    set style(style: PaintStyle) {
        this._style = style
        this.applyPaintStyle()
    }

    applyPaintStyle() {
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
}