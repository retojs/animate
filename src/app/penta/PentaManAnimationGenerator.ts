import { PentaManRelation } from "./PentaManRelation";
import { Animation, AnimationSection, ConnectedLineAnimation, LineAnimation, LineAnimationSection } from "../anim";
import { SVGLine } from "../svg";
import { Line, Point } from "comicvm-geometry-2d";
import { PentaMan } from "./PentaMan";
import { Penta } from "./Penta";
import { PaintStyle } from "comicvm-dom";

export const enum MappingType {
    MAN_TO_PENTA,
    PENTA_TO_MAN,
}

export class PentaManAnimationGenerator {

    public relation: PentaManRelation

    constructor(
        public animation: Animation,
        public pentaMan: PentaMan,
        public penta: Penta,
        public connectionGaps: number = 10,
        public connectionStyle?: PaintStyle,
    ) {
        this.relation = new PentaManRelation(pentaMan, penta)
    }

    toPentaAnimation(manAnimation: LineAnimation) {
        return this.mapAnimation(manAnimation, MappingType.MAN_TO_PENTA)
    }

    toManAnimation(pentaAnimation: LineAnimation) {
        return this.mapAnimation(pentaAnimation, MappingType.PENTA_TO_MAN)
    }

    toConnectedLineAnimation(
        animation: LineAnimation,
        mappingType: MappingType,
        styleCallback: (style: PaintStyle) => PaintStyle) {

        return new Animation(
            ...this.mapAnimationSectionsConnected(
                animation.sections as LineAnimationSection[],
                mappingType,
                styleCallback
            )
        )
    }

    mapAnimation(animation: LineAnimation, mappingType: MappingType) {

        return new LineAnimation(
            animation.svg,
            animation.startMillis,
            animation.defaultDuration,
            animation.defaultPaintStyle,
            ...this.mapAnimationSections(animation.sections as LineAnimationSection[], mappingType)
        )
    }

    mapAnimationSections(sections: LineAnimationSection[], mappingType: MappingType): LineAnimationSection[] {

        return sections.map(section => {
            if (section instanceof Animation) {
                return this.mapAnimationSections(section.sectionList as LineAnimationSection[], mappingType);
            } else if (section instanceof LineAnimationSection) {
                return [this.mapAnimationSection(section, mappingType)]
            } else {
                return []
            }
        }).reduce((flat, arr) =>
                flat.concat(arr),
            []
        )
    }

    mapAnimationSectionsConnected(
        sections: LineAnimationSection[],
        mappingType: MappingType,
        styleCallback: (style: PaintStyle) => PaintStyle
    ): ConnectedLineAnimation[] {

        return sections.map(section => {
            if (section instanceof Animation) {
                return this.mapAnimationSectionsConnected(
                    section.sectionList as LineAnimationSection[],
                    mappingType,
                    styleCallback
                );
            } else if (section instanceof LineAnimationSection) {
                const style = styleCallback && styleCallback(section.line.style.clone())

                return [
                    ConnectedLineAnimation.fromLineAnimationSection(
                        section,
                        this.mapLine(section.line, mappingType),
                        this.connectionGaps,
                        this.modifyStyle(style || section.line.style.clone(), {lineWidth: 1})
                    )
                ]
            } else {
                return []
            }
        }).reduce((flat, arr) =>
                flat.concat(arr),
            []
        )
    }

    mapAnimationSection(section: LineAnimationSection, direction: MappingType): LineAnimationSection {

        return new LineAnimationSection(
            this.mapLineSVG(section.line, direction),
            section.startMillis,
            section.endMillis
        )
    }

    mapLine(pentaLine: SVGLine, mappingType: MappingType): Line {
        let from: Point, to: Point

        if (mappingType === MappingType.MAN_TO_PENTA) {
            from = this.relation.getPentaPoint(pentaLine.x1, pentaLine.y1)
            to = this.relation.getPentaPoint(pentaLine.x2, pentaLine.y2)
        } else {
            from = this.relation.getManPoint(pentaLine.x1, pentaLine.y1)
            to = this.relation.getManPoint(pentaLine.x2, pentaLine.y2)
        }

        return new Line(from, to)
    }

    mapLineSVG(pentaLine: SVGLine, mappingType: MappingType): SVGLine {
        const line = this.mapLine(pentaLine, mappingType)

        return new SVGLine(line.from.x, line.from.y, line.to.x, line.to.y, pentaLine.style, pentaLine.svg)
    }

    modifyStyles(
        animation: Animation,
        callback: (section: AnimationSection) => void,
        sections: (Animation | AnimationSection)[] = animation.sections
    ) {
        sections.forEach(section => {
            if (section instanceof Animation) {
                return this.modifyStyles(animation, callback, section.sections || []);
            } else {
                callback(section)
            }
        })
    }

    modifyStyle(style: PaintStyle, modification: { [key: string]: any }): PaintStyle {
        (Object.keys(modification) || []).forEach(key => {
            style[key] = modification[key]
        })

        return style
    }

    replaceLineStyle(animation: LineAnimation, ...currentNewStylePairs: PaintStyle[]) {
        PentaManAnimationGenerator.getPairs(currentNewStylePairs)
            .forEach(([currentStyle, newStyle]) => {
                this.modifyStyles(animation, section => {
                    if (section instanceof LineAnimationSection) {
                        if (section.line.style === currentStyle) {
                            section.line.style = newStyle
                        }
                    }
                })
            })
    }

    static getPairs(styleParis: PaintStyle[]): [PaintStyle, PaintStyle][] {
        return (styleParis || []).reduce((pairs, style, index) => {
            if (index % 2) {
                pairs[pairs.length - 1].push(style)
            } else {
                pairs.push([style])
            }
            return pairs
        }, [])
    }
}
