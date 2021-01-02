import { Animation } from "./Animation"

export interface AnimatorConfig {
    name: String,
    repeatDelay?: number,
    mouseWheelAnimate?: HTMLElement
}

export class Animator {

    name: String
    animation: Animation

    isRunning = false
    startTime = 0

    isPaused = false
    pauseTime = 0

    repeatDelay: number

    constructor(
        config: AnimatorConfig
    ) {
        this.name = config.name
        this.repeatDelay = config.repeatDelay

        if (Number.isInteger(this.repeatDelay) && this.repeatDelay >= 0) {
            this.onEnd = () => this.startOver(this.repeatDelay)
        }

        if (config.mouseWheelAnimate) {
            config.mouseWheelAnimate.addEventListener("mouseenter", () => {
                this.pause()
            })
            config.mouseWheelAnimate.addEventListener("mouseleave", () => {
                this.resume()
            })
            config.mouseWheelAnimate.addEventListener("wheel", (e: WheelEvent) => {
                this.renderIncrement(e.deltaY)
                e.preventDefault()
            })
        }
    }

    getTime() {
        return this.isRunning
            ? new Date().getTime() - this.startTime
            : 0
    }

    start(animation: Animation) {
        this.animation = animation
        this.isRunning = true
        this.startTime = new Date().getTime()

        window.requestAnimationFrame(() => this.animate())

        console.log("Starting animation", this.name)
        animation.log()
    }

    stop() {
        this.isRunning = false
        this.startTime = 0
    }

    pause() {
        this.isPaused = true
        this.pauseTime = this.getTime()
    }

    resume() {
        this.isPaused = false
        this.startTime += this.getTime() - this.pauseTime
        this.animate()
    }

    animate() {
        this.animation.render(this.getTime())

        if (!this.isPaused) {
            if (this.isRunning && this.animation.isRunning(this.getTime())) {
                window.requestAnimationFrame(() => this.animate())
            } else {
                setTimeout(() => this.onEnd(), 100)
            }
        }
    }

    renderIncrement(deltaTime: number) {
        this.pauseTime += deltaTime
        window.requestAnimationFrame(() => {
            this.animation.render(this.pauseTime)
        })
    }

    startOver(delay: number = 0) {
        setTimeout(() => this.start(this.animation), delay)
    }

    onEnd = () => undefined

}