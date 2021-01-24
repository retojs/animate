import { AnimationSection } from "../../AnimationSection";
import { SVG, SVGShape } from "../../../svg";
import { PaintStyle } from "comicvm-dom";
import { ColorPalette } from "../../../style";

export class StyleAnimationSection extends AnimationSection {

    private sourceStyle: PaintStyle

    constructor(
        public svg: SVG,
        public shape: SVGShape,
        public targetStyle: PaintStyle,
        startMillis: number,
        endMillis: number,
    ) {
        super(startMillis, endMillis)

        this.sourceStyle = shape.style.clone()

        this.renderFn = function (time: number) {
            const progress = this.getProgress(time)
            this.shape.style = PaintStyle.fillAndStroke(
                this.blendColors(this.sourceStyle.fillStyle, this.targetStyle.fillStyle, progress),
                this.blendColors(this.sourceStyle.strokeStyle, this.targetStyle.strokeStyle, progress),
            )
        }
    }

    blendColors(source: string, target: string, progress: number) {
        const src: number[] = ColorPalette.colorFromString(source)
        const dst: number[] = ColorPalette.colorFromString(target)
        return ColorPalette.colorToString(
            src[0] + (dst[0] - src[0]) * progress,
            src[1] + (dst[1] - src[1]) * progress,
            src[2] + (dst[2] - src[2]) * progress,
            src[3] + (dst[3] - src[3]) * progress,
        )
    }

    remove() {
        this.shape.svg.remove(this.shape)
    }
}
