import { Line, Point } from "comicvm-geometry-2d";
import { PaintStyle } from "comicvm-dom";
import { SVGLine } from "../../svg";
import { Animation } from "../Animation";
import { DrawingLineAnimationSection } from "./DrawingLineAnimationSection";
import { ShapeAnimationSectionConfig } from "./ShapeAnimationSection";

export class DrawingLineAnimation extends Animation {

    startPoint: Point;

    static create(config: ShapeAnimationSectionConfig<any>): DrawingLineAnimation {
        const lineAnimation = new DrawingLineAnimation(config);

        lineAnimation.startPoint = new Point(0, 0);

        return lineAnimation;
    }

    /**
     * The rest arguments (lines) can be single lines or arrays of lines.
     * Lines in an array will be animated simultaneously.
     */
    static fromLines(
        config: ShapeAnimationSectionConfig<any>,
        ...lines: (Line | Line[])[]
    ): DrawingLineAnimation {
        const {startMillis, duration, style, svg} = config
        const lineAnimations = lines.map((lineGroup, index) => {
            const lineArray = Array.isArray(lineGroup) ? lineGroup : [lineGroup]
            return lineArray.map(line => new DrawingLineAnimationSection({
                shape: SVGLine.fromLine(line, style, svg),
                startMillis: startMillis + index * duration,
                duration
            }))
        }).reduce((flat, arr) => flat.concat(arr), [])

        return new DrawingLineAnimation(config, ...lineAnimations);
    }

    constructor(
        public config: ShapeAnimationSectionConfig<any>,
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
            : this.config.startMillis;
    }

    startFrom(x: number, y: number) {
        this.startPoint = new Point(x, y);

        return this;
    }

    lineTo(x: number, y: number, style?: PaintStyle): DrawingLineAnimation {

        const line = new SVGLine(
            this.lastPoint.x,
            this.lastPoint.y,
            x, y,
            style || this.config.style
        )

        this.config.svg.add(line);

        this.parts.push(new DrawingLineAnimationSection({
            shape: line,
            startMillis: this.lastTime,
            duration: this.config.duration
        }));

        return this;
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
                this.config.svg.insertBefore(ref.line, (this.parts[i] as DrawingLineAnimationSection).line)
            }
        })
    }

    moveBehind(ref: DrawingLineAnimationSection) {
        this.sectionList.forEach(section => {
            if (section instanceof DrawingLineAnimationSection) {
                this.config.svg.insertBefore(ref.line, (section as DrawingLineAnimationSection).line)
            }
        })
    }
}