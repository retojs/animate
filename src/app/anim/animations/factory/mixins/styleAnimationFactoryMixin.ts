import { PaintStyle } from "comicvm-dom";
import { SVGShape } from "../../../../svg";
import { blendColors } from "../../../../style/blendColors";
import { interpolateValue } from "../../../interpolateValue";
import { ShapeAnimationSection } from "../../ShapeAnimationSection";
import { ShapeAnimationFactory, ShapeAnimationSectionConfig } from "../ShapeAnimationFactory";
import { Constructor } from "./Constructor";

export interface StyleAnimationConfig<T extends SVGShape> extends ShapeAnimationSectionConfig<T> {
    targetStyle: PaintStyle
}

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
            config: StyleAnimationConfig<any>,
        ): ShapeAnimationSection<any> {
            config = {...this.config, ...config}

            const sourceStyle = config.shape.style && config.shape.style.clone()

            this.validateStyles(sourceStyle, config.targetStyle);

            const section = this.createShape(config)

            section.renderFn = function (time: number) {
                const progress = config.progressFn(this.getProgress(time))

                section.shape.style = PaintStyle.fillAndStroke(
                    blendColors(sourceStyle.fillStyle as string, config.targetStyle.fillStyle as string, progress),
                    blendColors(sourceStyle.strokeStyle as string, config.targetStyle.strokeStyle as string, progress),
                    interpolateValue(sourceStyle.lineWidth, config.targetStyle.lineWidth, progress),
                )
            }

            return section
        }

        addStyleChange(
            config: StyleAnimationConfig<any>
        ) {
            config = {...this.config, ...config}
            if (!this.config.parent) return

            this.config.parent.add(this.createStyleChange(config))
        }

        applyStyleChange(
            section: ShapeAnimationSection<any>,
            config: StyleAnimationConfig<any>
        ) {
            return this.createStyleChange({
                ...config,
                shape: section.shape,
                targetStyle: config.targetStyle
            })
        }
    }
}