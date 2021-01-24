import { Point } from "comicvm-geometry-2d";
import { SVGLine } from "../../../svg";
import { AnimationSection } from "../../AnimationSection"

export class DrawingLineAnimationSection extends AnimationSection {

    readonly x1: number
    readonly y1: number
    readonly x2: number
    readonly y2: number

    readonly from: Point
    readonly to: Point

    readonly line: SVGLine

    constructor(
        line: SVGLine,
        startMillis: number,
        endMillis: number,
    ) {
        super(startMillis, endMillis)

        this.line = line

        this.x1 = line.x1
        this.y1 = line.y1
        this.x2 = line.x2
        this.y2 = line.y2

        this.from = new Point(line.x1, line.y1)
        this.to = new Point(line.x2, line.y2)

        this.renderFn = function (time: number) {
            const progress = this.getProgress(time)
            this.line.x2 = this.x1 + (this.x2 - this.x1) * progress
            this.line.y2 = this.y1 + (this.y2 - this.y1) * progress
        }
    }

    clone() {
        return new DrawingLineAnimationSection(
            this.line.clone(),
            this.startMillis,
            this.endMillis
        )
    }

    cloneSilent() {
        return new DrawingLineAnimationSection(
            this.line.cloneSilent(),
            this.startMillis,
            this.endMillis
        )
    }

    remove() {
        this.line.svg.remove(this.line)
    }
}