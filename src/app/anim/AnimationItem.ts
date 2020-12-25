export  class AnimationItem {

    renderFn: (t: number) => void

    static create(startMillis: number,
                  endMillis: number,
                  renderFn: (t: number) => void
    ) {
        const animation = new AnimationItem(startMillis, endMillis)
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

    hasStarted(t: number): boolean {
        return this.startMillis < t
    }

    isOver(t: number): boolean {
        return t > this.endMillis
    }

    isRunning(t: number): boolean {
        return this.hasStarted(t) && !this.isOver(t)
    }

    /**
     * @returns a number between 0 and 1
     */
    getProgress(t: number) {
        return this.getProgressMillis(t) / this.duration
    }

    /**
     * @returns a number between 0 and the animation's duration in milliseconds
     */
    getProgressMillis(t: number) {
        return Math.max(0, Math.min(t, this.endMillis) - this.startMillis)
    }

     render(t: number) {
        if (this.renderFn) {
            this.renderFn(t)
        }
    }
}