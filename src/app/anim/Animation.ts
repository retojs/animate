import { AnimationSection } from "./AnimationSection";

export class Animation {

    sections: (AnimationSection | Animation)[]

    _sectionsSortedByStart: AnimationSection[]
    _sectionsSortedByEnd: AnimationSection[]

    hasCompleted = false

    public constructor(...sections: (AnimationSection | Animation)[]) {
        this.sections = sections
    }

    get sectionList(): AnimationSection[] {
        if (!this.sections || this.sections.length < 1) return [];

        return this.sections.map(section => {
            if (section instanceof Animation) {
                return section.sectionList;
            } else {
                return [section]
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
        return this.firstSection.startMillis <= time;
    }

    isOver(time: number): boolean {
        return time > this.lastSection.endMillis;
    }

    isRunning(time: number): boolean {
        return this.hasStarted(time) && !this.isOver(time);
    }

    add(...sections: (AnimationSection | Animation)[]) {
        this.sections = [...this.sections, ...sections];

        return this
    }

    render(time: number) {
        if (this.sections && !(this.isOver(time) && this.hasCompleted)) {
            this.sections.forEach(section => section.render(time))
        }
        if (!this.hasCompleted && this.isOver(time)) {
            this.hasCompleted = true
            this.onEnd()
        } else if (!this.isOver(time)) {
            this.hasCompleted = false
        }
    }

    shiftBy(time: number) {
        this.sections.forEach(section => {
            if (section instanceof Animation) {
                section.shiftBy(time);
            } else if (section instanceof AnimationSection) {
                section.startMillis += time
                section.endMillis += time
            }
        })
    }

    log() {
        // console.log("Animation Sections:")
        // this.sections.forEach(section => {
        //     if (section instanceof Animation) {
        //         section.log();
        //     } else if (section instanceof AnimationSection) {
        //         console.log(section.constructor.name, "- startMillis:", section.startMillis, "- endMillis:", section.endMillis);
        //     }
        // });
    }

    onEnd = () => undefined
}