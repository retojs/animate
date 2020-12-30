import { Point } from "comicvm-geometry-2d";
import { Animation, AnimationSection, ConnectedLineAnimation, LineAnimationSection } from "../anim";
import { PentaManRelation } from "./PentaManRelation";

const PULSE_INTERVAL = 5000

export class MovingPentaLineAnimationSection extends AnimationSection {

    sourceSections: LineAnimationSection[]
    sections: LineAnimationSection[]

    sourceConnectedLineAnimations: ConnectedLineAnimation[]
    connectedLineAnimations: ConnectedLineAnimation[]

    static fromConnectedLineAnimation(
        animation: Animation,
        relation: PentaManRelation,
        startMillis = 0,
        endMillis = 0
    ): MovingPentaLineAnimationSection {

        const section = new MovingPentaLineAnimationSection(animation, relation, startMillis, endMillis)

        section.processConnectedLineAnimations()

        section.renderFn = (time: number) => {
            const value = section.getValue(time)
            section.moveConnectedLineAnimations(value)
        }

        return section
    }

    static fromLineAnimation(
        animation: Animation,
        relation: PentaManRelation,
        startMillis = 0,
        endMillis = 0
    ): MovingPentaLineAnimationSection {

        const section = new MovingPentaLineAnimationSection(animation, relation, startMillis, endMillis)

        section.processLineAnimations()

        section.renderFn = (time: number) => {
            const value = section.getValue(time)
            section.moveLineAnimationSections(value)
        }

        return section
    }

    constructor(
        public animation: Animation,
        public relation: PentaManRelation,
        startMillis = 0,
        endMillis = 0
    ) {
        super(startMillis, endMillis)
    }

    processLineAnimations() {
        const lineAnimationSections: LineAnimationSection[] = this.animation.sectionList
            .filter(section => section instanceof LineAnimationSection) as LineAnimationSection[]

        this.animation.render(this.animation.firstSection.startMillis + this.animation.duration) // make lines visible

        this.sourceSections = lineAnimationSections
            .map((section: LineAnimationSection) => section.cloneSilent())
        this.sections = lineAnimationSections
            .map((section: LineAnimationSection) => section.clone())

        this.animation.render(0) // make lines invisible
    }

    processConnectedLineAnimations() {
        const connectedLineAnimations: ConnectedLineAnimation[] = this.animation.parts
            .filter(part => part instanceof ConnectedLineAnimation) as ConnectedLineAnimation[]

        this.sourceConnectedLineAnimations = connectedLineAnimations
        this.connectedLineAnimations = connectedLineAnimations
            .map(animation => animation.clone())

        connectedLineAnimations.forEach(animation => {
            animation.lineAnimationSection.line.svg.remove(animation.lineAnimationSection.line)
        })
    }

    getValue(time: number) {
        const dt = time - this.startMillis
        const value = 0.5 * (1 + Math.cos(dt / PULSE_INTERVAL * Math.PI * 2))
        return Math.max(0, Math.min(1, value))
    }

    moveLineAnimationSection(
        srcSection: LineAnimationSection,
        targetSection: LineAnimationSection,
        progress: number
    ) {
        srcSection.render(srcSection.endMillis)

        const targetFrom = this.relation.getManPoint(srcSection.line.x1, srcSection.line.y1);
        const targetTo = this.relation.getManPoint(srcSection.line.x2, srcSection.line.y2);

        if (!targetFrom || !targetTo) return

        const from = this.transformPoint(
            srcSection.line.x1,
            srcSection.line.y1,
            targetFrom.x,
            targetFrom.y,
            progress
        )
        const to = this.transformPoint(
            srcSection.line.x2,
            srcSection.line.y2,
            targetTo.x,
            targetTo.y,
            progress
        )

        targetSection.line.x1 = from.x
        targetSection.line.y1 = from.y
        targetSection.line.x2 = to.x
        targetSection.line.y2 = to.y
    }

    moveLineAnimationSections(progress: number) {
        this.sourceSections.forEach((srcSection, index) => {
            const targetSection = this.sections[index]
            this.moveLineAnimationSection(srcSection, targetSection, progress)
        })
    }

    moveConnectedLineAnimations(progress: number) {
        this.sourceConnectedLineAnimations.forEach((animation, index) => {
            const targetAnimation = this.connectedLineAnimations[index]
            this.moveLineAnimationSection(
                animation.lineAnimationSection,
                targetAnimation.lineAnimationSection,
                progress
            )
            targetAnimation.updateConnectionLines()
        })
    }

    transformPoint(srcX: number, srcY: number, targetX: number, targetY: number, progress: number): Point {
        const dx = (targetX - srcX) * progress
        const dy = (targetY - srcY) * progress

        return new Point(srcX + dx, srcY + dy)
    }
}