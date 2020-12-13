import { LineAnimationItem } from "./LineAnimationItem";
import { Animation } from "../Animation";
import { PaintStyle } from "comicvm-dom";
import { Point } from "comicvm-geometry-2d";

export class LineAnimation extends Animation {

    startPoint: Point;

    static create(
        x: number,
        y: number,
        defaultDuration?: number,
        defaultPaintStyle?: PaintStyle
    ): LineAnimation {
        const lineAnimation = new LineAnimation(defaultDuration, defaultPaintStyle);
        lineAnimation.startPoint = new Point(x, y);
        return lineAnimation;
    }

    constructor(
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

    lineTo(x: number, y: number): LineAnimation {
        this.items.push(
            new LineAnimationItem(
                this.lastPoint,
                new Point(x, y),
                this.defaultPaintStyle,
                this.lastTime,
                this.lastTime + this.defaultDuration)
        );

        return this;
    }
}