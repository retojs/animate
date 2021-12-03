import { Constructor } from "./Constructor";
import { ShapeAnimationFactory } from "../ShapeAnimationFactory";
import { Line } from "comicvm-geometry-2d";
import { ShapeAnimationConfig } from "../../ShapeAnimationConfig";
import { SVGLine } from "../../../../svg";
import { SVGShapeAnimationSection } from "../../SVGShapeAnimationSection";
import { interpolateValue } from "../../interpolateValue";
import { movePoint } from "../../movePoint";

export function lineAnimationFactoryMixin<T extends Constructor<ShapeAnimationFactory>>(BaseClass: T) {

    return class extends BaseClass {

        createShowLine(
            line: Line,
            config: ShapeAnimationConfig<SVGLine>,
        ) {
            return this.createSection({
                ...config,
                shape: SVGLine.fromLine(line, config.style, this.config.svg),
            })
        }

        createDrawLine(
            config: ShapeAnimationConfig<SVGLine>,
            reverse: boolean = false,
        ) {
            config = this.validateShapeAnimationConfig(config)

            const section = this.createSection(config)

            const line = config.shape as SVGLine

            const x1 = line.x1
            const y1 = line.y1
            const x2 = line.x2
            const y2 = line.y2

            section.renderFn = function (time: number) {
                const progress = config.progressFn(this.getProgress(time))

                if (reverse) {
                    line.x1 = interpolateValue(x1, x2, progress)
                    line.y1 = interpolateValue(y1, y2, progress)
                } else {
                    line.x2 = interpolateValue(x1, x2, progress)
                    line.y2 = interpolateValue(y1, y2, progress)
                }
            }

            return section
        }

        createDrawLineReverse(config: ShapeAnimationConfig<SVGLine>) {
            return this.createDrawLine(config, true)
        }

        addDrawLine(config: ShapeAnimationConfig<SVGLine>, reverse: boolean = false) {
            if (!this.config.parent) return

            this.config.parent.add(this.createDrawLine(config))
        }

        addDrawLineReverse(config: ShapeAnimationConfig<SVGLine>) {
            return this.addDrawLine(config, true)
        }

        applyDrawLine(
            section: SVGShapeAnimationSection<SVGLine>,
            config: ShapeAnimationConfig<SVGLine>
        ) {
            if (!this.config.parent) return

            const newSection = this.createDrawLine({
                ...config,
                shape: section.shape,
            })

            this.config.parent.add(newSection)

            return newSection
        }

        createMoveLine(
            targetLine: Line,
            config: ShapeAnimationConfig<SVGLine>
        ) {
            config = this.validateShapeAnimationConfig(config)

            const sourceLine = config.shape.cloneSilent()

            const section = this.createSection(config)

            section.renderFn = function (time: number) {
                const progress = config.progressFn(this.getProgress(time))

                const from = movePoint(
                    sourceLine.x1,
                    sourceLine.y1,
                    targetLine.from.x,
                    targetLine.from.y,
                    progress
                )
                const to = movePoint(
                    sourceLine.x2,
                    sourceLine.y2,
                    targetLine.to.x,
                    targetLine.to.y,
                    progress
                )

                section.shape.x1 = from.x
                section.shape.y1 = from.y
                section.shape.x2 = to.x
                section.shape.y2 = to.y
            }

            return section
        }
    }
}