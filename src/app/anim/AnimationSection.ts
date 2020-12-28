export class AnimationSection {

    renderFn: (time: number) => void

    hasCompleted = false

    static create(startMillis: number,
                  endMillis: number,
                  renderFn: (time: number) => void
    ) {
        const animation = new AnimationSection(startMillis, endMillis)
        animation.renderFn = renderFn
        return animation
    }

    constructor(
        public startMillis: number,
        public endMillis: number,
    ) {
    }

    get duration(): number {
        return this.endMillis - this.startMillis
    }

    hasStarted(time: number): boolean {
        return this.startMillis <= time
    }

    isOver(time: number): boolean {
        // return time > this.endMillis
        return !(this.endMillis === 0) && time > this.endMillis
    }

    isRunning(time: number): boolean {
        return this.hasStarted(time) && !this.isOver(time)
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

    render(time: number) {
        if (this.renderFn && !(this.isOver(time) && this.hasCompleted)) {
            this.renderFn(time)
        }
        if (!this.hasCompleted && this.isOver(time)) {
            this.hasCompleted = true
        } else if (!this.isOver(time)) {
            this.hasCompleted = false
        }
    }
}