import { Line, Point } from "comicvm-geometry-2d";
import { PaintStyle } from "comicvm-dom";
import { SVG, SVGLine } from "../../svg";
import { LineAnimationSection } from "./sections/LineAnimationSection";
import { Animation } from "../Animation";

export class LineAnimation extends Animation {

    startPoint: Point;

    static create(
        svg: SVG,
        x: number,
        y: number,
        startMillis: number,
        defaultDuration?: number,
        defaultPaintStyle?: PaintStyle,
    ): LineAnimation {

        const lineAnimation = new LineAnimation(svg, startMillis, defaultDuration, defaultPaintStyle);
        lineAnimation.startPoint = new Point(x, y);

        return lineAnimation;
    }

    /**
     * The last arguments (lines) can be single lines or arrays of lines.
     * Lines in an array will be animated simultaneously.
     *
     * @param svg
     * @param startMillis
     * @param defaultDuration
     * @param defaultPaintStyle
     * @param lines
     */
    static fromLines(
        svg: SVG,
        startMillis: number,
        defaultDuration?: number,
        defaultPaintStyle?: PaintStyle,
        ...lines: (Line | Line[])[]
    ): LineAnimation {

        const lineAnimations = lines.map((lineGroup, index) => {
            const lineArray = Array.isArray(lineGroup) ? lineGroup : [lineGroup]
            return lineArray.map(line => new LineAnimationSection(
                SVGLine.fromLine(line, defaultPaintStyle, svg),
                startMillis + index * defaultDuration,
                startMillis + index * defaultDuration + defaultDuration
            ))
        }).reduce((flat, arr) => flat.concat(arr), [])

        return new LineAnimation(svg, startMillis, defaultDuration, defaultPaintStyle, ...lineAnimations);
    }

    constructor(
        public svg: SVG,
        public startMillis = 0,
        public defaultDuration = 300,
        public defaultPaintStyle: PaintStyle = PaintStyle.stroke("black"),
        ...lines: LineAnimationSection[]
    ) {
        super(...lines);
    }

    get lastLine(): LineAnimationSection {
        return this.lastSection as LineAnimationSection;
    }

    get lastPoint(): Point {
        return this.sections && this.sections.length > 0
            ? this.lastLine.to
            : this.startPoint;
    }

    get lastTime() {
        return this.sections && this.sections.length > 0
            ? this.lastSection.endMillis
            : this.startMillis;
    }

    lineTo(x: number, y: number, style?: PaintStyle): LineAnimation {

        const line = new SVGLine(
            this.lastPoint.x,
            this.lastPoint.y,
            x, y,
            style || this.defaultPaintStyle
        )

        this.svg.add(line);

        this.sections.push(new LineAnimationSection(
            line,
            this.lastTime,
            this.lastTime + this.defaultDuration
        ));

        return this;
    }

    lineToo(next: Point): LineAnimation {
        return this.lineTo(next.x, next.y);
    }

    applyStyle(style: PaintStyle, ...lineIndex: number[]) {
        lineIndex.forEach(i => {
            if (this.sections[i]) {
                (this.sections[i] as LineAnimationSection).line.style = style
            }
        })
    }

    moveSectionsBehind(ref: LineAnimationSection, ...lineIndex: number[]) {
        lineIndex.forEach(i => {
            if (this.sections[i] && this.sections[i] instanceof LineAnimationSection) {
                this.svg.insertBefore(ref.line, (this.sections[i] as LineAnimationSection).line)
            }
        })
    }

    moveBehind(ref: LineAnimationSection) {
        this.sectionList.forEach(section => {
            if (section instanceof LineAnimationSection) {
                this.svg.insertBefore(ref.line, (section as LineAnimationSection).line)
            }
        })
    }
}