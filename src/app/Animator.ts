import { Canvas } from "comicvm-dom";
import { Animation } from "./Animation";

export class Animator {

    isRunning = false;
    startTime = 0;

    constructor(private canvas: Canvas) {
    }

    getTime() {
        return this.isRunning
            ? new Date().getTime() - this.startTime
            : 0;
    }

    start(animation: Animation) {
        this.isRunning = true;
        this.startTime = new Date().getTime();

        window.requestAnimationFrame(() => this.animate(animation));

        console.log("Starting animation");
        animation.log();
    }

    stop() {
        this.isRunning = false;
        this.startTime = 0;
    }

    animate(animation) {
        if (this.isRunning && !animation.isOver(this.getTime())) {
            animation.render(this.getTime(), this.canvas);
            window.requestAnimationFrame(() => this.animate(animation));
        }
    }
}