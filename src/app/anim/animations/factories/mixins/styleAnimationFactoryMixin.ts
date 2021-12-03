import { Constructor } from "./Constructor";
import { ShapeAnimationFactory } from "../ShapeAnimationFactory";
import { PaintStyle } from "comicvm-dom";
import { ShapeAnimationConfig } from "../../ShapeAnimationConfig";
import { SVGShapeAnimationSection } from "../../SVGShapeAnimationSection";
import { blendColors } from "../../../../style/blendColors";
import { interpolateValue } from "../../interpolateValue";

export function styleAnimationFactoryMixin<T extends Constructor<ShapeAnimationFactory>>(BaseClass?: T) {

    return class extends BaseClass {

        validateStyles(sourceStyle: PaintStyle, targetStyle: PaintStyle) {

            if (typeof targetStyle.fillStyle !== "string"
                || typeof targetStyle.strokeStyle !== "string"
                || typeof sourceStyle.fillStyle !== "string"
                || typeof sourceStyle.strokeStyle !== "string"
            ) {
                throw new Error("Can not blend gradients, colors must be of type string.");
            }
        }

        createStyleChange(
            targetStyle: PaintStyle,
            config: ShapeAnimationConfig<any>,
        ) {
            config = this.validateShapeAnimationConfig(config)

            const sourceStyle = config.shape.style && config.shape.style.clone()

            this.validateStyles(sourceStyle, targetStyle);

            const section = this.createSection(config)

            section.renderFn = function (time: number) {
                const progress = config.progressFn(this.getProgress(time))

                section.shape.style = PaintStyle.fillAndStroke(
                    blendColors(sourceStyle.fillStyle as string, targetStyle.fillStyle as string, progress),
                    blendColors(sourceStyle.strokeStyle as string, targetStyle.strokeStyle as string, progress),
                    interpolateValue(sourceStyle.lineWidth, targetStyle.lineWidth, progress),
                )
            }

            return section
        }

        addStyleChange(
            targetStyle: PaintStyle,
            config: ShapeAnimationConfig<any> = this.config,
        ) {
            if (!this.config.parent) return

            this.config.parent.add(this.createStyleChange(targetStyle, config))
        }

        applyStyleChange(
            section: SVGShapeAnimationSection<any>,
            targetStyle: PaintStyle,
            config: ShapeAnimationConfig<any> = {},
        ) {
            return this.createStyleChange(targetStyle, {
                ...config,
                shape: section.shape,
            })
        }
    }
}