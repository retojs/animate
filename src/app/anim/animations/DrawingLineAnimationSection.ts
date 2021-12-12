import { Point } from "comicvm-geometry-2d";
import { SVGLine } from "../../svg";
import { ShapeAnimationSection, ShapeAnimationSectionConfig } from "./ShapeAnimationSection";

export class DrawingLineAnimationSection extends ShapeAnimationSection<SVGLine> {

    readonly x1: number
    readonly y1: number
    readonly x2: number
    readonly y2: number

    readonly from: Point
    readonly to: Point

    readonly line: SVGLine

    constructor(
        config: ShapeAnimationSectionConfig<SVGLine>
    ) {
        super({...config, visibleUntil: config.visibleUntil || Number.POSITIVE_INFINITY})

        this.line = config.shape

        this.x1 = this.line.x1
        this.y1 = this.line.y1
        this.x2 = this.line.x2
        this.y2 = this.line.y2

        this.from = new Point(this.line.x1, this.line.y1)
        this.to = new Point(this.line.x2, this.line.y2)

        this.renderFn = function (time: number) {
            const progress = this.getProgress(time)
            this.line.x2 = this.x1 + (this.x2 - this.x1) * progress
            this.line.y2 = this.y1 + (this.y2 - this.y1) * progress
        }
    }

    clone() {
        return new DrawingLineAnimationSection({
            ...this.config,
            shape: this.line.clone()
        })
    }

    cloneSilent() {
        return new DrawingLineAnimationSection({
            ...this.config,
            shape: this.line.cloneSilent()
        })
    }

    remove() {
        this.line.svg.remove(this.line)
    }
}