import { Line, Point } from "comicvm-geometry-2d";
import { PaintStyle } from "comicvm-dom";
import { SVG, SVGLine } from "../../svg";
import { LineAnimationItem } from "./LineAnimationItem";
import { Animation } from "../Animation";

export class LineAnimation extends Animation {

    startPoint: Point;

    static create(
        svg: SVG,
        x: number,
        y: number,
        defaultDuration?: number,
        defaultPaintStyle?: PaintStyle,
    ): LineAnimation {

        const lineAnimation = new LineAnimation(svg, defaultDuration, defaultPaintStyle);
        lineAnimation.startPoint = new Point(x, y);

        return lineAnimation;
    }

    /**
     * The last arguments (lines) can be single lines or arrays of lines.
     * Lines in an array will be animated simultaneously.
     *
     * @param svg
     * @param defaultDuration
     * @param defaultPaintStyle
     * @param lines
     */
    static fromLines(
        svg: SVG,
        defaultDuration?: number,
        defaultPaintStyle?: PaintStyle,
        ...lines: (Line | Line[])[]
    ): LineAnimation {

        const lineAnimations = lines.map((lineGroup, index) => {
            const lineArray = Array.isArray(lineGroup) ? lineGroup : [lineGroup]
            return lineArray.map(line => new LineAnimationItem(
                SVGLine.fromLine(line, defaultPaintStyle, svg),
                index * defaultDuration,
                index * defaultDuration + defaultDuration
            ))
        }).reduce((flat, arr) => flat.concat(arr), [])

        return new LineAnimation(svg, defaultDuration, defaultPaintStyle, ...lineAnimations);
    }

    constructor(
        public svg,
        public defaultDuration = 300,
        public defaultPaintStyle: PaintStyle = PaintStyle.stroke("black"),
        ...lines: LineAnimationItem[]
    ) {
        super(...lines);
    }

    get lastLine(): LineAnimationItem {
        return this.lastItem as LineAnimationItem;
    }

    get lastPoint(): Point {
        return this.items && this.items.length > 0
            ? this.lastLine.to
            : this.startPoint;
    }

    get lastTime() {
        return this.items && this.items.length > 0
            ? this.lastItem.endMillis
            : 0;
    }

    lineTo(x: number, y: number, style?: PaintStyle): LineAnimation {

        const line = new SVGLine(
            this.lastPoint.x,
            this.lastPoint.y,
            x, y,
            style || this.defaultPaintStyle
        )

        this.svg.add(line);

        this.items.push(new LineAnimationItem(
            line,
            this.lastTime,
            this.lastTime + this.defaultDuration
        ));

        return this;
    }

    lineToo(next: Point): LineAnimation {
        return this.lineTo(next.x, next.y);
    }

    applyStyle(style: PaintStyle, ...lineIndex: number[]) {
        lineIndex.forEach(i => {
            if (this.items[i]) {
                (this.items[i] as LineAnimationItem).line.style = style
            }
        })
    }
}