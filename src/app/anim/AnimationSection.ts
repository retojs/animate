export interface AnimationSectionConfig {
    startMillis?: number,
    duration?: number,
    visibleFrom?: number,
    visibleUntil?: number,
    renderFn?: (time: number) => void,
    progressFn?: (time: number) => number
}

export class AnimationSection {

    startMillis: number
    duration: number
    visibleFrom: number
    visibleUntil: number
    renderFn: (time: number) => void
    progressFn?: (time: number) => number

    lastProgressRendered: number;

    static create(config: AnimationSectionConfig) {
        return new AnimationSection(config)
    }

    constructor(
        public config: AnimationSectionConfig
    ) {
        this.startMillis = config.startMillis == null
            ? 0
            : config.startMillis

        this.duration = config.duration == null
            ? Number.POSITIVE_INFINITY
            : config.duration

        this.visibleFrom = config.visibleFrom == null
            ? this.startMillis
            : config.visibleFrom

        this.visibleUntil = config.visibleUntil == null
            ? this.startMillis + this.duration
            : config.visibleUntil

        this.renderFn = config.renderFn
        this.progressFn = config.progressFn
    }

    get endMillis(): number {
        return this.startMillis + this.duration
    }

    hasStarted(time: number): boolean {
        return this.startMillis <= time
    }

    hasEnded(time: number): boolean {
        return !(this.duration === Number.POSITIVE_INFINITY) && this.endMillis < time
    }

    isRunning(time: number): boolean {
        return this.hasStarted(time) && !this.hasEnded(time)
    }

    isVisible(time: number): boolean {
        return this.visibleFrom <= time && (this.visibleUntil === 0 || time <= this.visibleUntil)
    }

    /**
     * @returns a number between 0 and 1
     */
    getProgress(time: number) {
        return this.getProgressMillis(time) / this.duration
    }

    /**
     * @returns a number between 0 and the animation's duration in milliseconds
     */
    getProgressMillis(time: number) {
        return Math.max(0, Math.min(time, this.endMillis) - this.startMillis)
    }

    /**
     * The render method will decide if the section should be rendered or not.
     *
     * Each time a section is rendered,
     * the current progress is remembered,
     * to avoid unnecessary rendering
     * with no changing effect.
     *
     * @param time
     */
    render(time: number) {
        if (!this.renderFn) return

        const progress = this.getProgress(time)
        if (progress !== this.lastProgressRendered) { // memoized renderFn
            this.renderFn(time)
        }
        this.lastProgressRendered = progress;
    }

    shiftTo(shiftedStartMillis) {
        const offset = shiftedStartMillis - this.startMillis
        this.startMillis = shiftedStartMillis
        this.visibleFrom = this.visibleFrom + offset
        this.visibleUntil = this.visibleUntil === 0 ? 0 : this.visibleUntil + offset
    }

    /**
     * Subclasses will have to implement the method how to remove themselves from the animation.
     */
    remove() {
        console.log("AnimationSection.remove() not implemented by", this.constructor.name)
    }
}