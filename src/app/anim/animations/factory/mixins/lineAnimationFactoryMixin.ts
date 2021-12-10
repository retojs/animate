import { Line, Point } from "comicvm-geometry-2d";
import { SVGLine } from "../../../../svg";
import { movePoint } from "../../../movePoint";
import { interpolateValue } from "../../../interpolateValue";
import { ShapeAnimationSection } from "../../ShapeAnimationSection";
import { ShapeAnimationFactory, ShapeAnimationSectionConfig } from "../ShapeAnimationFactory";
import { Constructor } from "./Constructor";

export function lineAnimationFactoryMixin<T extends Constructor<ShapeAnimationFactory>>(BaseClass: T) {

    return class extends BaseClass {

        createLine(
            line: Line,
            config: ShapeAnimationSectionConfig<SVGLine>,
        ): ShapeAnimationSection<any> {

            return this.createLineFromPoints(line.from, line.to, config);
        }

        createLineFromPoints(
            from: Point,
            to: Point,
            config: ShapeAnimationSectionConfig<SVGLine>,
        ): ShapeAnimationSection<any> {

            config = {...this.config, ...config}

            return this.createShape({
                ...config,
                shape: SVGLine.fromPoints(from, to, config.style, config.svg),
            })
        }

        createDrawLine(
            config: ShapeAnimationSectionConfig<SVGLine>,
            reverse: boolean = false,
        ): ShapeAnimationSection<any> {

            config = this.getAnimationConfig(config)

            const section = this.createShape(config)

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

        createDrawLineReverse(config: ShapeAnimationSectionConfig<SVGLine>) {
            return this.createDrawLine(config, true)
        }

        addDrawLine(config: ShapeAnimationSectionConfig<SVGLine>, reverse: boolean = false) {
            if (!this.config.parent) return

            this.config.parent.add(this.createDrawLine(config))
        }

        addDrawLineReverse(config: ShapeAnimationSectionConfig<SVGLine>) {
            return this.addDrawLine(config, true)
        }

        applyDrawLine(
            section: ShapeAnimationSection<SVGLine>,
            config: ShapeAnimationSectionConfig<SVGLine>
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
            config: ShapeAnimationSectionConfig<SVGLine>
        ) {
            config = this.getAnimationConfig(config)

            const sourceLine = config.shape.cloneSilent()

            const section = this.createShape(config)

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