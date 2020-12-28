import { LineAnimation, LineAnimationSection } from "../index";
import { SVG, SVGLine } from "../../svg";
import { PaintStyle } from "comicvm-dom";
import { Line } from "comicvm-geometry-2d";

export class ConnectedLineAnimation extends LineAnimation {

    connections: SVGLine[]
    connectionLineAnimations: LineAnimationSection[]

    lineAnimationItem: LineAnimationSection

    static fromLineAnimationSection(
        section: LineAnimationSection,
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
        style: PaintStyle
    ) {
        super(svg, startMillis, duration)

        this.lineAnimationItem = new LineAnimationSection(line, startMillis, startMillis + duration)
        this.add(this.lineAnimationItem)

        this.connectionLineAnimations = this.createConnections(connectionGaps, style, svg)
        this.add(...this.connectionLineAnimations)
        this.connectionLineAnimations.forEach(anim =>
            anim.line && anim.line.svg.insertBefore(this.lineAnimationItem.line, anim.line))
    }

    createConnections(connectionGaps: number, style: PaintStyle, svg: SVG) {
        const nofConnections = Math.round(this.line.length / connectionGaps)

        this.connections = Array.from(Array(nofConnections).keys())
            .map(i => {
                const cFromX = this.line.x1 + (this.line.x2 - this.line.x1) * i / (nofConnections - 1)
                const cFromY = this.line.y1 + (this.line.y2 - this.line.y1) * i / (nofConnections - 1)
                const cToX = this.connectedLine.from.x + (this.connectedLine.to.x - this.connectedLine.from.x) * i / (nofConnections - 1)
                const cToY = this.connectedLine.from.y + (this.connectedLine.to.y - this.connectedLine.from.y) * i / (nofConnections - 1)
                return new SVGLine(cFromX, cFromY, cToX, cToY, style, svg)
            })

        return this.connections.map((connection, index) => {
            const connectionDuration = this.duration / this.connections.length
            const start = this.startMillis + index * connectionDuration
            const end = start + connectionDuration

            return new LineAnimationSection(connection, start, end)
        })
    }
}
