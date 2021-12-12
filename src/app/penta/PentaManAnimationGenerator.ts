import { Line, Point } from "comicvm-geometry-2d";
import { PaintStyle } from "comicvm-dom";
import { SVGLine } from "../svg";
import {
    Animation,
    AnimationSection,
    ConnectedLineAnimation,
    DrawingLineAnimation,
    DrawingLineAnimationSection
} from "../anim";
import { Penta } from "./Penta";
import { PentaMan } from "./PentaMan";
import { PentaManRelation } from "./PentaManRelation";

export const enum PentaMappingType {
    MAN_TO_PENTA,
    PENTA_TO_MAN,
}

export class PentaManAnimationGenerator {

    public relation: PentaManRelation

    constructor(
        public animation: Animation,
        public pentaMan: PentaMan,
        public penta: Penta,
        public gapWidth: number = 5,
    ) {
        this.relation = new PentaManRelation(pentaMan, penta)
    }

    toPentaAnimation(manAnimation: DrawingLineAnimation) {
        return this.mapAnimation(manAnimation, PentaMappingType.MAN_TO_PENTA)
    }

    toManAnimation(pentaAnimation: DrawingLineAnimation) {
        return this.mapAnimation(pentaAnimation, PentaMappingType.PENTA_TO_MAN)
    }

    toConnectedLineAnimation(
        animation: DrawingLineAnimation,
        mappingType: PentaMappingType,
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

    mapAnimation(animation: DrawingLineAnimation, mappingType: PentaMappingType) {

        return new DrawingLineAnimation(
            animation.config,
            ...this.mapAnimationSections(animation.parts as DrawingLineAnimationSection[], mappingType)
        )
    }

    mapAnimationSections(sections: DrawingLineAnimationSection[], mappingType: PentaMappingType): DrawingLineAnimationSection[] {

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
        mappingType: PentaMappingType,
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
                        {
                            startMillis: section.startMillis,
                            duration: section.duration,
                            connectedLine: this.mapLine(section.line, mappingType),
                            gapWidth: this.gapWidth,
                            style: this.modifyStyle(style || section.line.style.clone(), {lineWidth: 1})
                        })
                ]
            } else {
                return []
            }
        }).reduce((flat, arr) =>
                flat.concat(arr),
            []
        )
    }

    mapAnimationSection(section: DrawingLineAnimationSection, direction: PentaMappingType): DrawingLineAnimationSection {

        return new DrawingLineAnimationSection(
            this.mapLineSVG(section.line, direction),
            section.startMillis,
            section.endMillis
        )
    }

    mapLine(line: SVGLine, mappingType: PentaMappingType): Line {
        let from: Point, to: Point

        if (mappingType === PentaMappingType.MAN_TO_PENTA) {
            from = this.relation.getPentaPoint(line.x1, line.y1)
            to = this.relation.getPentaPoint(line.x2, line.y2)
        } else {
            from = this.relation.getManPoint(line.x1, line.y1)
            to = this.relation.getManPoint(line.x2, line.y2)
        }

        return new Line(from, to)
    }

    mapLineSVG(line: SVGLine, mappingType: PentaMappingType): SVGLine {
        const mappedLine = this.mapLine(line, mappingType)

        return new SVGLine(
            mappedLine.from.x, mappedLine.from.y,
            mappedLine.to.x, mappedLine.to.y,
            line.style, line.svg
        )
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
