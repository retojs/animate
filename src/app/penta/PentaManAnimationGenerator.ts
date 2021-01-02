import { PentaManRelation } from "./PentaManRelation";
import { Animation, AnimationSection, ConnectedLineAnimation, DrawingLineAnimation, DrawingLineAnimationSection } from "../anim";
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
        public connectionGaps: number = 5,
        public connectionStyle?: PaintStyle,
    ) {
        this.relation = new PentaManRelation(pentaMan, penta)
    }

    toPentaAnimation(manAnimation: DrawingLineAnimation) {
        return this.mapAnimation(manAnimation, MappingType.MAN_TO_PENTA)
    }

    toManAnimation(pentaAnimation: DrawingLineAnimation) {
        return this.mapAnimation(pentaAnimation, MappingType.PENTA_TO_MAN)
    }

    toConnectedLineAnimation(
        animation: DrawingLineAnimation,
        mappingType: MappingType,
        styleCallback: (style: PaintStyle) => PaintStyle
    ): Animation {

        return new Animation(
            ...this.mapAnimationSectionsConnected(
                animation.parts as DrawingLineAnimationSection[],
                mappingType,
                styleCallback
            )
        )
    }

    mapAnimation(animation: DrawingLineAnimation, mappingType: MappingType) {

        return new DrawingLineAnimation(
            animation.svg,
            animation.startMillis,
            animation.defaultDuration,
            animation.defaultPaintStyle,
            ...this.mapAnimationSections(animation.parts as DrawingLineAnimationSection[], mappingType)
        )
    }

    mapAnimationSections(sections: DrawingLineAnimationSection[], mappingType: MappingType): DrawingLineAnimationSection[] {

        return sections.map(section => {
            if (section instanceof Animation) {
                return this.mapAnimationSections(section.sectionList as DrawingLineAnimationSection[], mappingType);
            } else if (section instanceof DrawingLineAnimationSection) {
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
        sections: DrawingLineAnimationSection[],
        mappingType: MappingType,
        styleCallback: (style: PaintStyle) => PaintStyle
    ): ConnectedLineAnimation[] {

        return sections.map(section => {
            if (section instanceof Animation) {
                return this.mapAnimationSectionsConnected(
                    section.sectionList as DrawingLineAnimationSection[],
                    mappingType,
                    styleCallback
                );
            } else if (section instanceof DrawingLineAnimationSection) {
                const style = styleCallback && styleCallback(section.line.style.clone())

                return [
                    ConnectedLineAnimation.fromDrawingLineAnimationSection(
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

    mapAnimationSection(section: DrawingLineAnimationSection, direction: MappingType): DrawingLineAnimationSection {

        return new DrawingLineAnimationSection(
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
        parts: (Animation | AnimationSection)[] = animation.parts
    ) {
        parts.forEach(part => {
            if (part instanceof Animation) {
                return this.modifyStyles(animation, callback, part.parts || []);
            } else {
                callback(part)
            }
        })
    }

    modifyStyle(style: PaintStyle, modification: { [key: string]: any }): PaintStyle {
        (Object.keys(modification) || []).forEach(key => {
            style[key] = modification[key]
        })

        return style
    }

    replaceLineStyle(animation: DrawingLineAnimation, ...currentNewStylePairs: PaintStyle[]) {
        PentaManAnimationGenerator.getPairs(currentNewStylePairs)
            .forEach(([currentStyle, newStyle]) => {
                this.modifyStyles(animation, section => {
                    if (section instanceof DrawingLineAnimationSection) {
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
