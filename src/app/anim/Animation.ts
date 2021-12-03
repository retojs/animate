import { AnimationSection } from "./AnimationSection";

/**
 * An Animation contains an array of parts, which can be AnimationSections or nested Animations.
 * It calls render(time) on all it's parts when render(time) is called on an animation.
 */
export class Animation {

    parts: (AnimationSection | Animation)[]

    /**
     * Indicates that the animation has called render(time) with time >= endMillis, i.e. progress = 100%.
     */
    isComplete = false

    onCompleteHanders = [];

    set onComplete(fn: () => void) {
        console.log("onComplete Handler added", fn)
        this.onCompleteHanders = [...this.onCompleteHanders, fn]
    }

    public constructor(...parts: (AnimationSection | Animation)[]) {
        this.parts = parts
    }

    notifyComplete() {
        this.onCompleteHanders.forEach(handler => {
            console.log("notifyComplete - calling handler", handler)
            handler()
        })
    }

    /**
     * @returns all sections from all it's parts flattened into one array of AnimationSections.
     */
    get sectionList(): AnimationSection[] {
        if (!this.parts || this.parts.length < 1) return [];

        return this.parts.map(part => {
            if (part instanceof Animation) {
                return part.sectionList;
            } else {
                return [part]
            }
        }).reduce((flat, arr) => flat.concat(arr), [])
    }

    /**
     * @returns the section in this animation that starts first.
     */
    get firstSection(): AnimationSection {
        const sectionsSortedByStart = this.sectionList.sort((a, b) => {
            if (a.startMillis < b.startMillis) return -1
            if (a.startMillis > b.startMillis) return 1
            return 0
        });

        return sectionsSortedByStart[0];
    }

    /**
     * @returns the section in this animation that ends last.
     */
    get lastSection(): AnimationSection {
        const sectionsSortedByEnd = this.sectionList.sort((a, b) => {
            if (a.endMillis < b.endMillis) return -1
            if (a.endMillis > b.endMillis) return 1
            return 0
        });

        return sectionsSortedByEnd[sectionsSortedByEnd.length - 1];
    }

    get duration(): number {
        return this.lastSection.endMillis - this.firstSection.startMillis;
    };

    hasStarted(time: number): boolean {
        return this.firstSection && this.firstSection.startMillis <= time;
    }

    hasEnded(time: number): boolean {
        return this.lastSection && !(this.lastSection.endMillis === 0) && time > this.lastSection.endMillis;
    }

    hasCompleted(time: number): boolean {
        return this.hasEnded(time) && this.isComplete
    }

    isRunning(time: number): boolean {
        return this.hasStarted(time) && !this.hasEnded(time);
    }

    add(...parts: (AnimationSection | Animation)[]): Animation {
        this.parts = [...this.parts, ...parts];

        return this
    }

    append(section: AnimationSection, delayMillis: number = 0): Animation {
        const startMillis = ((this.lastSection && this.lastSection.endMillis) || 0) + delayMillis
        section.shiftTo(startMillis)
        this.add(section)

        return this
    }


    appendParallel(sections: AnimationSection[], delayMillis: number = 0): Animation {
        const startMillis = ((this.lastSection && this.lastSection.endMillis) || 0) + delayMillis;

        (sections || []).forEach(section => {
            section.shiftTo(startMillis)
            this.add(section)
        })

        return this
    }

    appendAll(delayMillis: number, ...sections: (AnimationSection | AnimationSection[])[]): Animation {
        (sections || []).forEach(s => {
            if (Array.isArray(s)) {
                this.appendParallel(s, delayMillis)
            } else {
                this.append(s, delayMillis)
            }
        })

        return this
    }

    /**
     * The render method will decide if the animation's parts should be rendered or not.
     *
     * The specified time may be in one of three ranges: before, during or after the animation's duration.
     * It will call it's parts' render method before, during and one time after the animation is over.
     * This makes sure that the animation is rendered in progress = 0% immediately,
     * and that the animation will be rendered in progress = 100% at least once.
     * Once it has been rendered in progress = 100% the animation is called "complete"
     *   and it's isComplete flag will be true
     *   and it's onComplete handler will be called.
     * If render is called with a time before it's ending it will set the animation's isComplete flag to false.
     * This allows you to repeat the animation.
     *
     * @param time
     */
    render(time: number) {
        if (!this.parts) return;

        if (!this.hasCompleted(time)) {
            this.parts.forEach(part => part.render(time))
        }

        if (this.hasEnded(time)) {
            if (!this.isComplete) {
                this.isComplete = true
                this.notifyComplete()
            }
        } else {
            this.isComplete = false
        }
    }

    remove() {
        (this.sectionList || []).forEach(section => section.remove())
    }

    shiftBy(time: number) {
        this.parts.forEach(part => {
            if (part instanceof Animation) {
                part.shiftBy(time);
            } else if (part instanceof AnimationSection) {
                part.startMillis += time
                part.endMillis += time
            }
        })
    }

    log() {
        console.log("Animation Sections:")
        this.parts.forEach(part => {
            if (part instanceof Animation) {
                part.log();
            } else if (part instanceof AnimationSection) {
                console.log(part.constructor.name, "- startMillis:", part.startMillis, "- endMillis:", part.endMillis, "- visibleFrom:", part.visibleFrom, "- visibleUntil:", part.visibleUntil);
            }
        });
    }
}
