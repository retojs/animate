import { Animation } from "./Animation"
import { isElementVisibleInViewport } from "./isElementVisibleInViewport";

export interface AnimatorConfig {
    name?: String
    repeatDelay?: number
    htmlElement?: HTMLElement
}

const defaultConfig: AnimatorConfig = {
    name: "",
    repeatDelay: 0,
    htmlElement: null
}

export class Animator {

    isRunning = false
    startTime = 0

    isPaused = false
    pauseTime = 0

    get name() {
        return this.config.name
    }

    constructor(
        public animation: Animation,
        public config: AnimatorConfig = defaultConfig
    ) {
        animation.onComplete = () => this.startOver(this.config.repeatDelay)
        this.setupMouseWheelAnimate();
    }

    getTime() {
        return this.isRunning
            ? new Date().getTime() - this.startTime
            : 0
    }

    start() {
        this.isRunning = true
        this.startTime = new Date().getTime()

        window.requestAnimationFrame(() => this.animate())

        console.log("Starting animation", this.config.name)
        // this.animation.log()
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

    render(time) {
        if (this.config.htmlElement && !isElementVisibleInViewport(this.config.htmlElement)) return
        this.animation.render(time)
    }

    animate() {
        this.render(this.getTime())

        if (!this.isPaused) {
            if (this.isRunning) {
                window.requestAnimationFrame(() => this.animate())
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
        setTimeout(() => this.start(), delay)
    }

    onEnd = () => undefined

    setupMouseWheelAnimate() {
        if (this.config.htmlElement) {
            this.config.htmlElement.addEventListener("mouseenter", () => {
                this.pause()
            })
            this.config.htmlElement.addEventListener("mouseleave", () => {
                this.resume()
            })
            this.config.htmlElement.addEventListener("wheel", (e: WheelEvent) => {
                this.renderIncrement(e.deltaY)
                e.preventDefault()
            })
        }
    }
}

