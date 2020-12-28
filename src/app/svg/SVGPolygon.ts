import { PaintStyle } from "comicvm-dom";
import { SVG, SVG_NAMESPACE } from "./SVG";
import { SVGShape } from "./SVGShape";
import { Point } from "comicvm-geometry-2d";


export class SVGPolygon extends SVGShape {

    private _points: Point[] = [];

    static fromPoints(points: Point[], style: PaintStyle, svg?: SVG): SVGPolygon {
        return new SVGPolygon(points, style, svg)
    }

    constructor(points: Point[], style: PaintStyle, svg?: SVG) {
        super(style, svg);

        this._points = points;

        this.element = document.createElementNS(SVG_NAMESPACE, 'polygon')
        this.element.setAttributeNS(null, 'points', this.pointsToString(points))

        this.applyPaintStyle()

        if (svg) svg.add(this)
    }

    get points(): Point[] {
        return this._points;
    }

    set points(points: Point[]) {
        this.element.setAttributeNS(null, "x1", this.pointsToString(points))
    }

    pointsToString(points: Point[]): string {
        return points.map(p =>
            Math.round(p.x * 100) * 0.01 +
            "," +
            Math.round(p.y * 100) * 0.01
        )
            .join(' ')
    }
}