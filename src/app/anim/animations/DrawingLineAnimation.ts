import { Line, Point } from "comicvm-geometry-2d";
import { PaintStyle } from "comicvm-dom";
import { SVG, SVGLine } from "../../svg";
import { DrawingLineAnimationSection } from "./sections/DrawingLineAnimationSection";
import { Animation } from "../Animation";

export class DrawingLineAnimation extends Animation {

    startPoint: Point;

    static create(
        svg: SVG,
        x: number,
        y: number,
        startMillis: number,
        defaultDuration?: number,
        defaultPaintStyle?: PaintStyle,
    ): DrawingLineAnimation {

        const lineAnimation = new DrawingLineAnimation(svg, startMillis, defaultDuration, defaultPaintStyle);
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
    ): DrawingLineAnimation {

        const lineAnimations = lines.map((lineGroup, index) => {
            const lineArray = Array.isArray(lineGroup) ? lineGroup : [lineGroup]
            return lineArray.map(line => new DrawingLineAnimationSection(
                SVGLine.fromLine(line, defaultPaintStyle, svg),
                startMillis + index * defaultDuration,
                startMillis + index * defaultDuration + defaultDuration
            ))
        }).reduce((flat, arr) => flat.concat(arr), [])

        return new DrawingLineAnimation(svg, startMillis, defaultDuration, defaultPaintStyle, ...lineAnimations);
    }

    constructor(
        public svg: SVG,
        public startMillis = 0,
        public defaultDuration = 300,
        public defaultPaintStyle: PaintStyle = PaintStyle.stroke("black"),
        ...lines: DrawingLineAnimationSection[]
    ) {
        super(...lines);
    }

    get lastLine(): DrawingLineAnimationSection {
        return this.lastSection as DrawingLineAnimationSection;
    }

    get lastPoint(): Point {
        return this.parts && this.parts.length > 0
            ? this.lastLine.to
            : this.startPoint;
    }

    get lastTime() {
        return this.parts && this.parts.length > 0
            ? this.lastSection.endMillis
            : this.startMillis;
    }

    lineTo(x: number, y: number, style?: PaintStyle): DrawingLineAnimation {

        const line = new SVGLine(
            this.lastPoint.x,
            this.lastPoint.y,
            x, y,
            style || this.defaultPaintStyle
        )

        this.svg.add(line);

        this.parts.push(new DrawingLineAnimationSection(
            line,
            this.lastTime,
            this.lastTime + this.defaultDuration
        ));

        return this;
    }

    lineToo(next: Point): DrawingLineAnimation {
        return this.lineTo(next.x, next.y);
    }

    applyStyle(style: PaintStyle, ...lineIndex: number[]) {
        lineIndex.forEach(i => {
            if (this.parts[i] && (this.parts[i] as DrawingLineAnimationSection).line) {
                (this.parts[i] as DrawingLineAnimationSection).line.style = style
            }
        })
    }

    moveSectionsBehind(ref: DrawingLineAnimationSection, ...lineIndex: number[]) {
        lineIndex.forEach(i => {
            if (this.parts[i] && this.parts[i] instanceof DrawingLineAnimationSection) {
                this.svg.insertBefore(ref.line, (this.parts[i] as DrawingLineAnimationSection).line)
            }
        })
    }

    moveBehind(ref: DrawingLineAnimationSection) {
        this.sectionList.forEach(section => {
            if (section instanceof DrawingLineAnimationSection) {
                this.svg.insertBefore(ref.line, (section as DrawingLineAnimationSection).line)
            }
        })
    }
}