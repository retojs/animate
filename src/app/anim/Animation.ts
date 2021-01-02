import { AnimationSection } from "./AnimationSection";

export class Animation {

    parts: (AnimationSection | Animation)[]

    _sectionsSortedByStart: AnimationSection[]
    _sectionsSortedByEnd: AnimationSection[]

    hasCompleted = false

    public constructor(...parts: (AnimationSection | Animation)[]) {
        this.parts = parts
    }

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

    get firstSection(): AnimationSection {
        this._sectionsSortedByStart = this.sectionList.sort((a, b) => {
            if (a.startMillis < b.startMillis) return -1
            if (a.startMillis > b.startMillis) return 1
            return 0
        });

        return this._sectionsSortedByStart[0];
    }

    get lastSection(): AnimationSection {
        this._sectionsSortedByEnd = this.sectionList.sort((a, b) => {
            if (a.endMillis < b.endMillis) return -1
            if (a.endMillis > b.endMillis) return 1
            return 0
        });

        return this._sectionsSortedByEnd[this._sectionsSortedByEnd.length - 1];
    }

    get duration(): number {
        return this.lastSection.endMillis - this.firstSection.startMillis;
    };

    hasStarted(time: number): boolean {
        return this.firstSection && this.firstSection.startMillis <= time;
    }

    isOver(time: number): boolean {
        return this.lastSection && !(this.lastSection.endMillis === 0) && time > this.lastSection.endMillis;
    }

    isRunning(time: number): boolean {
        return this.hasStarted(time) && !this.isOver(time);
    }

    add(...parts: (AnimationSection | Animation)[]) {
        this.parts = [...this.parts, ...parts];

        return this
    }

    render(time: number) {
        if (this.parts && !(this.isOver(time) && this.hasCompleted)) {
            this.parts.forEach(part => part.render(time))
        }
        if (!this.hasCompleted && this.isOver(time)) {
            this.hasCompleted = true
            this.onEnd()
        } else if (!this.isOver(time)) {
            this.hasCompleted = false
        }
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
        // console.log("Animation Sections:")
        // this.sections.forEach(part => {
        //     if (part instanceof Animation) {
        //         part.log();
        //     } else if (part instanceof AnimationSection) {
        //         console.log(part.constructor.name, "- startMillis:", part.startMillis, "- endMillis:", part.endMillis);
        //     }
        // });
    }

    onEnd = () => undefined
}