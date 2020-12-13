import { AnimationItem } from "../AnimationItem";
import { Point } from "comicvm-geometry-2d";
import { Canvas, PaintStyle } from "comicvm-dom";

export class LineAnimationItem extends AnimationItem {

    constructor(
        public from: Point,
        public to: Point,
        public paintStyle: PaintStyle,
        startMillis: number,
        endMillis: number,
    ) {
        super(startMillis, endMillis);
    }

    render(t: number, canvas: Canvas) {
        const progress = this.getProgress(t);
        const p = new Point(
            this.from.x + (this.to.x - this.from.x) * progress,
            this.from.y + (this.to.y - this.from.y) * progress
        );
        canvas.lineFromTo(this.from, p, this.paintStyle);

    }
}