import { AnimationItem } from "./AnimationItem";
import { Canvas } from "comicvm-dom";

export class Animation {

    items: (AnimationItem | Animation)[]

    public constructor(...items: (AnimationItem | Animation)[]) {
        this.items = items
    }

    get firstItem(): AnimationItem {
        if (!this.items || this.items.length < 1) return null;

        const firstItem = this.items[0];
        if (firstItem instanceof Animation) {
            return firstItem.firstItem;
        }
        return firstItem;

    }

    get lastItem(): AnimationItem {
        if (!this.items || this.items.length < 1) return null;

        const lastItem = this.items[this.items.length - 1];
        if (lastItem instanceof Animation) {
            return lastItem.lastItem;
        }
        return lastItem;
    }

    get duration(): number {
        // TODO items are not necessarily ordered by time, animations could run in parallel...
        return this.lastItem.endMillis - this.firstItem.startMillis;
    };

    hasStarted(t: number): boolean {
        return this.firstItem.startMillis > t;
    }

    isOver(t: number): boolean {
        return t > this.lastItem.endMillis;
    }

    isRunning(t: number): boolean {
        return this.hasStarted(t) && !this.isOver(t);
    }

    render(t: number, canvas: Canvas) {
        this.items.forEach(item => item.render(t, canvas))
    }

    log() {
        console.log("Animation Items:")
        this.items.forEach(item => {
            if (item instanceof Animation) {
                item.log();
            } else if (item instanceof AnimationItem) {
                console.log(item.constructor.name, "- startMillis:", item.startMillis, "- endMillis:", item.endMillis);
            }
        });
    }
}