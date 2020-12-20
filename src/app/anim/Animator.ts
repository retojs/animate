import { Animation } from "./Animation"

export class Animator {

    animation: Animation

    isRunning = false
    startTime = 0

    constructor(
        public name: String = ""
    ) {}

    getTime() {
        return this.isRunning
            ? new Date().getTime() - this.startTime
            : 0
    }

    start(animation: Animation) {
        this.animation = animation
        this.isRunning = true
        this.startTime = new Date().getTime()

        window.requestAnimationFrame(() => this.animate(animation))

        console.log("Starting animation", this.name)
        animation.log()
    }

    stop() {
        this.isRunning = false
        this.startTime = 0
    }

    animate(animation: Animation) {
        animation.render(this.getTime())
        if (this.isRunning && animation.isRunning(this.getTime())) {
            window.requestAnimationFrame(() => this.animate(animation))
        } else {
           setTimeout(() => this.onEnd(), 100)
        }
    }

    startOver(delay: number = 0) {
        setTimeout(() => this.start(this.animation), delay)
    }

    onEnd = () => undefined

}