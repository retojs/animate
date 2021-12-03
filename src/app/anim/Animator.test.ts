import { Animator } from "./Animator";
import { Animation } from "./Animation";

describe("Animator.ts", () => {

    let animation: Animation
    let animator: Animator

    beforeEach(() => {

        animation = new Animation()
        animator = new Animator(animation, {
            repeatDelay: 10,
            name: "animator",
        })
    })

    test(".start() will set the isRunning flag to true.", () => {
        expect(animator.isRunning).toBeFalsy()
        animator.start()
        expect(animator.isRunning).toBeTruthy()
    })

    test(".stop() will set the isRunning flag to false.", () => {
        animator.start()
        expect(animator.isRunning).toBeTruthy()
        animator.stop()
        expect(animator.isRunning).toBeFalsy()
    })

    test(".pause() will set the isPaused flag to true.", () => {
        expect(animator.isPaused).toBeFalsy()
        animator.pause()
        expect(animator.isPaused).toBeTruthy()
    })

    test(".resume() will set the isPaused flag to false.", () => {
        animator.pause()
        expect(animator.isPaused).toBeTruthy()
        animator.resume()
        expect(animator.isPaused).toBeFalsy()
    })

    test(".animate() will call the animation´s render method.", () => {
        const renderSpy = spyOn(animation, "render")
        animator.animate()
        expect(renderSpy).toHaveBeenCalledTimes(1)
    })

})