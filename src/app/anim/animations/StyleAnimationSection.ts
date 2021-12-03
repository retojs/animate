import { AnimationSection } from "../AnimationSection";
import { SVG, SVGShape } from "../../svg";
import { PaintStyle } from "comicvm-dom";
import { blendColors } from "../../style/blendColors";

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
                blendColors(this.sourceStyle.fillStyle, this.targetStyle.fillStyle, progress),
                blendColors(this.sourceStyle.strokeStyle, this.targetStyle.strokeStyle, progress),
            )
        }
    }


    remove() {
        this.shape.svg.remove(this.shape)
    }
}
