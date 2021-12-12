import { Circle, Point } from "comicvm-geometry-2d";
import { SVGCircle } from "../../../../svg";
import { movePoint } from "../../../movePoint";
import { interpolateValue } from "../../../interpolateValue";
import { ShapeAnimationSection, ShapeAnimationSectionConfig } from "../../ShapeAnimationSection";
import { ShapeAnimationFactory } from "../ShapeAnimationFactory";
import { Constructor } from "./Constructor";

export function circleAnimationFactoryMixin<T extends Constructor<ShapeAnimationFactory>>(BaseClass: T) {

    return class extends BaseClass {

        createCircle(
            circle: Circle,
            config: ShapeAnimationSectionConfig<any>,
        ): ShapeAnimationSection<any> {

            return this.createCircleWithRadius(new Point(circle.x, circle.y), circle.radius, config);
        }

        createCircleWithRadius(
            center: Point,
            radius: number,
            config: ShapeAnimationSectionConfig<any>,
        ): ShapeAnimationSection<any> {

            config = {...this.config, ...config};

            return this.createShape({
                ...config,
                shape: SVGCircle.fromPoint(center, radius, config.style, config.svg),
            })
        }

        createMoveCircle(
            target: Circle,
            config: ShapeAnimationSectionConfig<SVGCircle>
        ): ShapeAnimationSection<any> {

            config = {...this.config, ...config};

            const section = this.createShape(config)

            const initial = {
                x: config.shape.x,
                y: config.shape.y,
                radius: config.shape.radius
            }

            section.renderFn = function (time: number) {
                let progress = section.getProgress(time)
                if (typeof config.progressFn === "function") {
                    progress = config.progressFn(progress)
                }

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
            config: ShapeAnimationSectionConfig<SVGCircle>
        ): ShapeAnimationSection<any> {

            if (!this.config.parent) return

            const section = this.createMoveCircle(target, config)
            this.config.parent.add(section)

            return section
        }

        applyMoveCircle(
            section: ShapeAnimationSection<SVGCircle>,
            target: Circle,
            config?: ShapeAnimationSectionConfig<SVGCircle>
        ) {
            if (!this.config.parent) return

            const newSection = this.createMoveCircle(target, {
                ...config,
                shape: section.shape as SVGCircle,
            })

            this.config.parent.add(newSection)

            return newSection
        }
    }
}