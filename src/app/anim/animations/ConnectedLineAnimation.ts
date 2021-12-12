import { PaintStyle } from "comicvm-dom";
import { Line } from "comicvm-geometry-2d";
import { SVG, SVGLine, SVGShape } from "../../svg";
import { DrawingLineAnimation, } from "./DrawingLineAnimation";
import { DrawingLineAnimationSection } from "./DrawingLineAnimationSection";
import { ShapeAnimationSectionConfig } from "./factory/ShapeAnimationFactory";

export interface ConnectedLineAnimationConfig<T extends SVGShape> extends ShapeAnimationSectionConfig<T> {
    line?: SVGLine,
    connectedLine?: Line
    gapWidth?: number
    connectionStyle?: PaintStyle
}

/**
 * Two lines connected by a set of connection lines with a specified gap from each other.
 */
export class ConnectedLineAnimation extends DrawingLineAnimation {

    lineAnimationSection: DrawingLineAnimationSection

    connectionLines: SVGLine[]
    connectionLineAnimationSections: DrawingLineAnimationSection[]

    static fromDrawingLineAnimationSection(
        section: DrawingLineAnimationSection,
        config: ConnectedLineAnimationConfig<SVGLine>
    ) {
        return new ConnectedLineAnimation({
            ...config,
            line: section.line.clone()
        })
    }

    constructor(
        public config: ConnectedLineAnimationConfig<SVGLine>
    ) {
        super(config)

        const {line, startMillis, duration, gapWidth, style, svg} = config

        this.lineAnimationSection = new DrawingLineAnimationSection(line, startMillis, startMillis + duration)
        this.add(this.lineAnimationSection)

        this.connectionLineAnimationSections = this.createConnectionLines(gapWidth, style, svg)
        this.add(...this.connectionLineAnimationSections)
        this.connectionLineAnimationSections.forEach(section => {
            line.svg.insertBefore(this.lineAnimationSection.line, section.line)
        })
    }

    createConnectionLines(gapWidth: number, style: PaintStyle, svg: SVG): DrawingLineAnimationSection[] {
        const nofConnections = Math.round(this.config.line.length / gapWidth)

        this.connectionLines = Array.from(Array(nofConnections).keys())
            .map(i => {
                const {x1, y1, x2, y2} = this.calculateConnectionLine(i, nofConnections)
                return new SVGLine(x1, y1, x2, y2, style, svg)
            })

        return this.connectionLines.map((connection, index) => {
            const connectionDuration = this.config.duration / this.connectionLines.length
            const start = this.config.startMillis + index * connectionDuration
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
        const {line, connectedLine} = this.config

        return {
            x1: line.x1 + (line.x2 - line.x1) * index / (nofConnections - 1),
            y1: line.y1 + (line.y2 - line.y1) * index / (nofConnections - 1),
            x2: connectedLine.from.x + (connectedLine.to.x - connectedLine.from.x) * index / (nofConnections - 1),
            y2: connectedLine.from.y + (connectedLine.to.y - connectedLine.from.y) * index / (nofConnections - 1)
        }
    }

    clone() {
        return new ConnectedLineAnimation({
                ...this.config,
                line: this.config.line.clone(),
                connectedLine: this.config.connectedLine.clone()
            }
        )
    }

    cloneSilent() {
        return new ConnectedLineAnimation({
                ...this.config,
                line: this.config.line.cloneSilent(),
                connectedLine: this.config.connectedLine.clone(),
            }
        )
    }
}
