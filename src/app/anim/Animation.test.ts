import { Animation } from "./Animation"
import { AnimationSection } from "./AnimationSection"

describe("AnimationSection.ts", () => {

    let section: AnimationSection
    let animation: Animation

    beforeEach(() => {
        section = new AnimationSection(1, 100)
        animation = new Animation(section)
    })

    test(".hasStarted(time) returns false if time < startMillis", () => {
        expect(animation.hasStarted(0)).toBe(false)
    })
    test(".hasStarted(time) returns true if time >= startMillis", () => {
        expect(animation.hasStarted(1)).toBe(true)
        expect(animation.hasStarted(2)).toBe(true)
        expect(animation.hasStarted(100)).toBe(true)
    })

    test(".isOver(time) returns false if time <= endMillis", () => {
        expect(animation.isOver(0)).toBe(false)
        expect(animation.isOver(1)).toBe(false)
        expect(animation.isOver(100)).toBe(false)
    })
    test(".isOver(time) returns false if time > endMillis", () => {
        expect(animation.isOver(101)).toBe(true)
    })

    test("render will set isCompleted to true when the animation is over", () => {
        expect(animation.hasCompleted).toBe(false)
        animation.render(101)
        expect(animation.hasCompleted).toBe(true)
    })
    test("render will set isCompleted to false when the animation is not over", () => {
        animation.render(101)
        expect(animation.hasCompleted).toBe(true)
        animation.render(1)
        expect(animation.hasCompleted).toBe(false)
    })

    test("onEnd will be called after the animation has completed", () => {
        const onEndSpy = jest.spyOn(animation, "onEnd")

        animation.render(101)
        expect(onEndSpy).toHaveBeenCalled()
    })
    test("onEnd will only be called once after the animation has completed", () => {
        animation.render(101)

        const onEndSpy = jest.spyOn(animation, "onEnd")

        animation.render(102)
        expect(onEndSpy).not.toHaveBeenCalled()
    })

    describe(".firstSection", () => {

        let section1: AnimationSection
        let section2: AnimationSection
        let section3: AnimationSection

        beforeEach(() => {
            section1 = new AnimationSection(50, 150)
            section2 = new AnimationSection(0, 100)
            section3 = new AnimationSection(1, 50)
            animation = new Animation(section1, section2, section3)
        })

        test("returns the section that starts first", () => {
            expect(animation.firstSection).toEqual(section2)
        })
    })

    describe(".lastSection", () => {

        let section1: AnimationSection
        let section2: AnimationSection
        let section3: AnimationSection

        beforeEach(() => {
            section1 = new AnimationSection(50, 150)
            section2 = new AnimationSection(0, 100)
            section3 = new AnimationSection(1, 50)
            animation = new Animation(section1, section2, section3)
        })

        test("returns the section that starts first", () => {
            expect(animation.lastSection).toEqual(section1)
        })
    })
})