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
        expect(section.hasStarted(0)).toBe(false)
    })
    test(".hasStarted(time) returns true if time >= startMillis", () => {
        expect(section.hasStarted(1)).toBe(true)
        expect(section.hasStarted(2)).toBe(true)
        expect(section.hasStarted(100)).toBe(true)
    })

    test(".isOver(time) returns false if time <= endMillis", () => {
        expect(section.isOver(0)).toBe(false)
        expect(section.isOver(1)).toBe(false)
        expect(section.isOver(100)).toBe(false)
    })
    test(".isOver(time) returns false if time > endMillis", () => {
        expect(section.isOver(101)).toBe(true)
    })

    test("render will set isCompleted to true when the section is over", () => {
        expect(section.hasCompleted).toBe(false)
        section.render(101)
        expect(section.hasCompleted).toBe(true)
    })
    test("render will set isCompleted to false when the section is not over", () => {
        section.render(101)
        expect(section.hasCompleted).toBe(true)
        section.render(1)
        expect(section.hasCompleted).toBe(false)
    })
    test("render will not be executed after a section has completed", () => {
        section.renderFn = () => 0

        section.render(101)
        expect(section.hasCompleted).toBe(true)

        const renderSpy = jest.spyOn(section, "renderFn")
        section.render(102)
        expect(renderSpy).not.toHaveBeenCalled()
    })

})