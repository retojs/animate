import { Animation } from "./Animation"
import { AnimationSection } from "./AnimationSection"

describe("Animation.ts", () => {

    let section: AnimationSection
    let animation: Animation

    let section1: AnimationSection
    let section2: AnimationSection
    let section3: AnimationSection

    beforeEach(() => {
        section = new AnimationSection({startMillis: 0, duration: 100})
        animation = new Animation(section)

        section1 = new AnimationSection({startMillis: 50, duration: 100})
        section2 = new AnimationSection({startMillis: 0, duration: 100})
        section3 = new AnimationSection({startMillis: 1, duration: 50})
    })

    test(".hasStarted(time) returns false if time < startMillis", () => {
        expect(animation.hasStarted(-1)).toBe(false)
    })
    test(".hasStarted(time) returns true if time >= startMillis", () => {
        expect(animation.hasStarted(0)).toBe(true)
        expect(animation.hasStarted(50)).toBe(true)
        expect(animation.hasStarted(100)).toBe(true)
        expect(animation.hasStarted(1001)).toBe(true)
    })

    test(".hasEnded(time) returns false if time <= endMillis", () => {
        expect(animation.hasEnded(-1)).toBe(false)
        expect(animation.hasEnded(0)).toBe(false)
        expect(animation.hasEnded(1)).toBe(false)
        expect(animation.hasEnded(100)).toBe(false)
    })
    test(".hasEnded(time) returns false if time > endMillis", () => {
        expect(animation.hasEnded(101)).toBe(true)
    })

    test(".firstSection returns the section that starts first", () => {
        animation = new Animation(section1, section2, section3)
        expect(animation.firstSection).toEqual(section2)
    })

    test(".lastSection returns the section that starts last", () => {
        animation = new Animation(section1, section2, section3)
        expect(animation.lastSection).toEqual(section1)
    })

    test(".add(...sections) adds a list of sections to the animation", () => {
        expect(animation.parts).toEqual([section])
        animation.add(section1, section2, section3)
        expect(animation.parts).toEqual([section, section1, section2, section3])
    })

    describe(".append(section, delay)", () => {

        test("adds an animation section such that it starts after the last section has ended.", () => {
            animation = new Animation(section1, section2, section3)
            const lastSection = animation.lastSection
            animation.append(section)
            expect(section.startMillis).toEqual(lastSection.endMillis)
        })

        test("adds an animation section such that it starts after the last section has ended and a delay has passed.", () => {
            animation = new Animation(section1, section2, section3)
            const lastSection = animation.lastSection
            animation.append(section, 100)
            expect(lastSection.endMillis + 100).toEqual(section.startMillis)
        })

        test("adds an animation section to an empty animation.", () => {
            animation = new Animation()
            animation.append(section, 100)
            expect(section.startMillis).toBe(100)
        })

        test("shifts the visibility range, too, if visibility is limited.", () => {
            animation = new Animation()
            section.visibleFrom = 0
            section.visibleUntil = 100
            animation.append(section, 100)
            expect(section.visibleFrom).toBe(100)
            expect(section.visibleUntil).toBe(200)
        })

        test("does not shift the unlimited ends of the visibility range.", () => {
            animation = new Animation()
            section.visibleFrom = 0
            section.visibleUntil = Number.POSITIVE_INFINITY
            animation.append(section, 100)
            expect(section.visibleFrom).toBe(100)
            expect(section.visibleUntil).toBe(Number.POSITIVE_INFINITY)
        })
    })

    describe(".appendParallel(sections, delay)", () => {

        test("adds multiple animation sections such that all start after the last section has ended.", () => {
            const lastSection = animation.lastSection
            animation.appendParallel([section1, section2, section3], 10)
            expect(section1.startMillis).toEqual(lastSection.endMillis + 10)
            expect(section2.startMillis).toEqual(lastSection.endMillis + 10)
            expect(section3.startMillis).toEqual(lastSection.endMillis + 10)
        })
    })

    describe(".appendAll(sections, delay)", () => {

        test("appends multiple animation sections. Sections grouped in an array are appended in parallel.", () => {
            const lastSection = animation.lastSection

            animation.appendAll(30,
                [section1, section2],
                section3
            )
            expect(section1.startMillis).toEqual(lastSection.endMillis + 30)
            expect(section2.startMillis).toEqual(lastSection.endMillis + 30)

            const endMillis = Math.max(section1.endMillis, section2.endMillis)
            expect(section3.startMillis).toEqual(endMillis + 30)
        })
    })

    describe(".render(time)", () => {

        test("will call render on all it's parts, even if it has not started yet, to set progress in all to 0%.", () => {
            const renderSpy = jest.spyOn(section, "render")
            animation.render(0)
            expect(renderSpy).toHaveBeenCalledTimes(1)
        })

        test("does render animation parts if the animation has started and has not yet completed.", () => {
            const renderSpy = jest.spyOn(section, "render")
            animation.render(1)
            animation.render(50)
            animation.render(100)
            expect(renderSpy).toHaveBeenCalledTimes(3)
        })

        test("does render animation parts one single last time if the animation has ended, i.e. progress has reached 100%.", () => {
            const renderSpy = jest.spyOn(section, "render")
            animation.render(101)
            animation.render(101)
            animation.render(101)
            expect(renderSpy).toHaveBeenCalledTimes(1)
        })

        test("sets the animation's isComplete flag to true if the animation is complete (progress = 100%).", () => {
            expect(animation.isComplete).toBe(false)
            animation.render(101)
            expect(animation.isComplete).toBe(true)
        })

        test("sets the animation's isComplete flag to false if the animation is not complete (progress < 100%).", () => {
            animation.render(101)
            expect(animation.isComplete).toBe(true)
            animation.render(1)
            expect(animation.isComplete).toBe(false)
        })

        test("calls the animation's onComplete listeners if the animation is complete (progress = 100%).", () => {
            const notifyCompleteSpy = jest.spyOn(animation, "notifyComplete")
            animation.render(101)
            expect(notifyCompleteSpy).toHaveBeenCalledTimes(1)
        })

        test(".notifyComplete() will only be called once after the animation has completed (progress = 100%)", () => {
            animation.render(101)
            const notifyCompleteSpy = jest.spyOn(animation, "notifyComplete")
            animation.render(102)
            expect(notifyCompleteSpy).not.toHaveBeenCalled()
        })

        test(".notifyComplete() will call all onComplete listeners", () => {
            let listenerCalls = 0

            animation.onComplete = () => {
                expect(listenerCalls).toBe(0)
                listenerCalls += 1
            }
            animation.onComplete = () => {
                expect(listenerCalls).toBe(1)
                listenerCalls += 1
            }
            animation.onComplete = () => {
                expect(listenerCalls).toBe(2)
            }

            animation.notifyComplete()
        })
    })

})