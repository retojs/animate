import { Constructor } from "./Constructor";
import { ShapeAnimationFactory } from "../ShapeAnimationFactory";
import { Circle } from "comicvm-geometry-2d";
import { ShapeAnimationConfig } from "../../ShapeAnimationConfig";
import { SVGCircle } from "../../../../svg";
import { SVGShapeAnimationSection } from "../../SVGShapeAnimationSection";
import { movePoint } from "../../movePoint";
import { interpolateValue } from "../../interpolateValue";

export function circleAnimationFactoryMixin<T extends Constructor<ShapeAnimationFactory>>(BaseClass: T) {

    return class extends BaseClass {

        createShowCircle(
            circle: Circle,
            radius: number,
            config: ShapeAnimationConfig<any>,
        ) {
            return this.createSection({
                ...config,
                shape: new SVGCircle(circle.x, circle.y, radius, config.style, this.config.svg),
            })
        }

        createMoveCircle(
            target: Circle,
            config: ShapeAnimationConfig<SVGCircle>
        ) {
            config = this.validateShapeAnimationConfig(config)

            const section = this.createSection(config)

            const initial = {
                x: config.shape.x,
                y: config.shape.y,
                radius: config.shape.radius
            }

            section.renderFn = function (time: number) {
                const progress = config.progressFn(section.getProgress(time))

                const p = movePoint(
                    initial.x,
                    initial.y,
                    target.x,
                    target.y,
                    progress,
                )

                config.shape.x = p.x
                config.shape.y = p.y
                config.shape.radius = interpolateValue(initial.radius, target.radius, progress)
            }

            return section
        }

        addMoveCircle(
            target: Circle,
            config: ShapeAnimationConfig<SVGCircle>
        ) {
            if (!this.config.parent) return

            const section = this.createMoveCircle(target, config)
            this.config.parent.add(section)

            return section
        }

        applyMoveCircle(
            section: SVGShapeAnimationSection<SVGCircle>,
            target: Circle,
            config?: ShapeAnimationConfig<SVGCircle>
        ) {
            if (!this.config.parent) return

            const newSection = this.createMoveCircle(target, {
                ...config,
                shape: section.shape,
            })

            this.config.parent.add(newSection)

            return newSection
        }
    }
}