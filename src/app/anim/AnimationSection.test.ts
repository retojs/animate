import { Animation } from "./Animation"
import { AnimationSection } from "./AnimationSection"

describe("AnimationSection.ts", () => {

    let section: AnimationSection
    let sectionInfinite: AnimationSection
    let animation: Animation

    beforeEach(() => {
        section = new AnimationSection({startMillis: 0, duration: 100})
        sectionInfinite = new AnimationSection({startMillis: 0, duration: Number.POSITIVE_INFINITY})
        animation = new Animation(section)
    })

    test(".endMillis equals startMillis + duration", () => {
        expect(section.endMillis).toBe(section.startMillis + section.duration)
    })

    describe(".hasStarted(time)", () => {

        test("returns false if time < startMillis", () => {
            expect(section.hasStarted(-1)).toBe(false)
            expect(sectionInfinite.hasStarted(-1)).toBe(false)
        })

        test("returns true if time >= startMillis", () => {
            expect(section.hasStarted(0)).toBe(true)
            expect(section.hasStarted(1)).toBe(true)
            expect(section.hasStarted(100)).toBe(true)
            expect(section.hasStarted(101)).toBe(true)

            expect(sectionInfinite.hasStarted(0)).toBe(true)
            expect(sectionInfinite.hasStarted(1)).toBe(true)
            expect(sectionInfinite.hasStarted(100)).toBe(true)
            expect(sectionInfinite.hasStarted(101)).toBe(true)
        })
    })

    describe(".hasEnded(time)", () => {

        test("returns false if time <= endMillis if the section is not infinite.", () => {
            expect(section.hasEnded(-1)).toBe(false)
            expect(section.hasEnded(0)).toBe(false)
            expect(section.hasEnded(1)).toBe(false)
            expect(section.hasEnded(100)).toBe(false)
        })

        test("returns false if time > endMillis if the section is not infinite.", () => {
            expect(section.hasEnded(101)).toBe(true)
        })

        test("never returns true for an infinite section (endMillis = 0).", () => {
            expect(sectionInfinite.hasEnded(0)).toBe(false)
            expect(sectionInfinite.hasEnded(1)).toBe(false)
            expect(sectionInfinite.hasEnded(100)).toBe(false)
            expect(sectionInfinite.hasEnded(1010101)).toBe(false)
        })
    })

    describe(".isVisible(time)", () => {
        test("returns the same values as isRunning with the default settings.", () => {
            expect(section.isVisible(0)).toBe(section.isRunning(0))
            expect(section.isVisible(1)).toBe(section.isRunning(1))
            expect(section.isVisible(100)).toBe(section.isRunning(100))
            expect(section.isVisible(101)).toBe(section.isRunning(101))
        })

        test("returns true if time is between visibleFrom and visibleUntil if the section is not infinite.", () => {
            section.visibleFrom = 5
            section.visibleUntil = 105
            expect(section.isVisible(4)).toBe(false)
            expect(section.isVisible(5)).toBe(true)
            expect(section.isVisible(105)).toBe(true)
            expect(section.isVisible(106)).toBe(false)
        })

        test("returns true for any time after startMillis for an infinite section (duration == Number.POSITIVE_INFINITY).", () => {
            expect(sectionInfinite.isVisible(-1)).toBe(false)
            expect(sectionInfinite.isVisible(0)).toBe(true)
            expect(sectionInfinite.isVisible(1)).toBe(true)
            expect(sectionInfinite.isVisible(100)).toBe(true)
            expect(sectionInfinite.isVisible(1010101)).toBe(true)
        })
    })
})