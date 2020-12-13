export abstract class AnimationItem {

    constructor(
        public startMillis: number,
        public endMillis: number,
    ) {
    }

    get duration(): number {
        return this.endMillis - this.startMillis;
    };

    hasStarted(t: number): boolean {
        return this.startMillis > t;
    }

    isOver(t: number): boolean {
        return t > this.endMillis;
    }

    isRunning(t: number): boolean {
        return this.hasStarted(t) && !this.isOver(t);
    }

    getProgress(t: number) {
        return Math.max(0, Math.min(t, this.endMillis) - this.startMillis) / this.duration;
    }

    abstract render(t: number, canvas: any);
}