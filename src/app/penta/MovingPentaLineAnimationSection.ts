import {
    Animation,
    AnimationSection,
    ConnectedLineAnimation,
    DrawingLineAnimationSection,
    getSinusValue,
    movePoint
} from "../anim";
import { PentaManRelation } from "./PentaManRelation";

export class MovingPentaLineAnimationSection extends AnimationSection {

    sourceSections: DrawingLineAnimationSection[]
    sections: DrawingLineAnimationSection[]

    sourceConnectedLineAnimations: ConnectedLineAnimation[]
    connectedLineAnimations: ConnectedLineAnimation[]

    static fromConnectedLineAnimation(
        animation: Animation,
        relation: PentaManRelation,
        startMillis: number = 0,
        frequency: number
    ): MovingPentaLineAnimationSection {

        const section = new MovingPentaLineAnimationSection(animation, relation, startMillis)

        section.processConnectedLineAnimations()

        section.renderFn = (time: number) => {
            const value = getSinusValue(section.startMillis, time, frequency)
            section.moveConnectedLineAnimations(value)
        }

        return section
    }

    static fromLineAnimation(
        animation: Animation,
        relation: PentaManRelation,
        startMillis: number = 0,
        frequency: number
    ): MovingPentaLineAnimationSection {

        const section = new MovingPentaLineAnimationSection(animation, relation, startMillis)

        section.processLineAnimations()

        section.renderFn = (time: number) => {
            const value = getSinusValue(section.startMillis, time, frequency)
            section.moveLineAnimationSections(value)
        }

        return section
    }

    constructor(
        public animation: Animation,
        public relation: PentaManRelation,
        startMillis: number = 0,
    ) {
        super(startMillis, 0)
    }

    processLineAnimations() {
        const lineAnimationSections: DrawingLineAnimationSection[] = this.animation.sectionList
            .filter(section => section instanceof DrawingLineAnimationSection) as DrawingLineAnimationSection[]

        this.animation.render(this.animation.firstSection.startMillis + this.animation.duration) // make lines visible

        this.sourceSections = lineAnimationSections
            .map((section: DrawingLineAnimationSection) => section.cloneSilent())
        this.sections = lineAnimationSections
            .map((section: DrawingLineAnimationSection) => section.clone())

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

    moveLineAnimationSection(
        srcSection: DrawingLineAnimationSection,
        targetSection: DrawingLineAnimationSection,
        progress: number
    ) {
        srcSection.render(srcSection.endMillis)

        const targetFrom = this.relation.getManPoint(srcSection.line.x1, srcSection.line.y1);
        const targetTo = this.relation.getManPoint(srcSection.line.x2, srcSection.line.y2);

        if (!targetFrom || !targetTo || !srcSection) return

        const from = movePoint(
            srcSection.line.x1,
            srcSection.line.y1,
            targetFrom.x,
            targetFrom.y,
            progress
        )
        const to = movePoint(
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
}