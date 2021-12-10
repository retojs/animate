import { DrawingLineAnimation, } from "./DrawingLineAnimation";
import { DrawingLineAnimationSection } from "./DrawingLineAnimationSection";
import { SVG, SVGLine } from "../../svg";
import { PaintStyle } from "comicvm-dom";
import { Line } from "comicvm-geometry-2d";

export class ConnectedLineAnimation extends DrawingLineAnimation {

    lineAnimationSection: DrawingLineAnimationSection

    connectionLines: SVGLine[]
    connectionLineAnimationSections: DrawingLineAnimationSection[]

    static fromDrawingLineAnimationSection(
        section: DrawingLineAnimationSection,
        connectedLine: Line,
        connectionGaps: number = 10,
        style: PaintStyle = section.line.style.clone()
    ) {
        return new ConnectedLineAnimation(
            section.line.svg,
            section.line.clone(),
            connectedLine,
            connectionGaps,
            section.startMillis,
            section.duration,
            style
        )
    }

    constructor(
        public svg: SVG,
        public line: SVGLine,
        public connectedLine: Line,
        public connectionGaps: number,
        startMillis: number,
        duration: number,
        public style: PaintStyle
    ) {
        super(svg, startMillis, duration)

        this.lineAnimationSection = new DrawingLineAnimationSection(line, startMillis, startMillis + duration)
        this.add(this.lineAnimationSection)

        this.connectionLineAnimationSections = this.createConnectionLines(connectionGaps, style, svg)
        this.add(...this.connectionLineAnimationSections)
        this.connectionLineAnimationSections.forEach(section =>
            section.line && section.line.svg.insertBefore(this.lineAnimationSection.line, section.line)
        )
    }

    createConnectionLines(connectionGaps: number, style: PaintStyle, svg: SVG): DrawingLineAnimationSection[] {
        const nofConnections = Math.round(this.line.length / connectionGaps)

        this.connectionLines = Array.from(Array(nofConnections).keys())
            .map(i => {
                const {x1, y1, x2, y2} = this.calculateConnectionLine(i, nofConnections)
                return new SVGLine(x1, y1, x2, y2, style, svg)
            })

        return this.connectionLines.map((connection, index) => {
            const connectionDuration = this.defaultDuration / this.connectionLines.length
            const start = this.startMillis + index * connectionDuration
            const end = start + connectionDuration

            return new DrawingLineAnimationSection(connection, start, end)
        })
    }

    updateConnectionLines() {
        this.connectionLines.forEach((line: SVGLine, index) => {
            const {x1, y1, x2, y2} = this.calculateConnectionLine(index, this.connectionLineAnimationSections.length)
            line.x1 = x1
            line.y1 = y1
            line.x2 = x2
            line.y2 = y2
        })
    }

    calculateConnectionLine(index: number, nofConnections: number) {
        return {
            x1: this.line.x1 + (this.line.x2 - this.line.x1) * index / (nofConnections - 1),
            y1: this.line.y1 + (this.line.y2 - this.line.y1) * index / (nofConnections - 1),
            x2: this.connectedLine.from.x + (this.connectedLine.to.x - this.connectedLine.from.x) * index / (nofConnections - 1),
            y2: this.connectedLine.from.y + (this.connectedLine.to.y - this.connectedLine.from.y) * index / (nofConnections - 1)
        }
    }

    clone() {
        return new ConnectedLineAnimation(
            this.svg,
            this.line.clone(),
            this.connectedLine.clone(),
            this.connectionGaps,
            this.startMillis,
            this.defaultDuration,
            this.style
        )
    }

    cloneSilent() {
        return new ConnectedLineAnimation(
            this.svg,
            this.line.cloneSilent(),
            this.connectedLine.clone(),
            this.connectionGaps,
            this.startMillis,
            this.defaultDuration,
            this.style
        )
    }
}
