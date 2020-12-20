import { AnimationItem } from "./AnimationItem";

export class Animation {

    items: (AnimationItem | Animation)[]

    _itemsSortedByStart: AnimationItem[]
    _itemsSortedByEnd: AnimationItem[]

    public constructor(...items: (AnimationItem | Animation)[]) {
        this.items = items
    }

    get itemList(): AnimationItem[] {
        if (!this.items || this.items.length < 1) return [];

        return this.items.map(item => {
            if (item instanceof Animation) {
                return item.itemList;
            } else {
                return [item]
            }
        }).reduce((flat, arr) => flat.concat(arr), [])
    }

    get firstItem(): AnimationItem {
        this._itemsSortedByStart = this.itemList.sort((a, b) => {
            if (a.startMillis < b.startMillis) return -1
            if (a.startMillis > b.startMillis) return 1
            return 0
        });

        return this._itemsSortedByStart[0];
    }

    get lastItem(): AnimationItem {
        this._itemsSortedByEnd = this.itemList.sort((a, b) => {
            if (a.endMillis < b.endMillis) return -1
            if (a.endMillis > b.endMillis) return 1
            return 0
        });

        return this._itemsSortedByEnd[this._itemsSortedByEnd.length - 1];
    }

    get duration(): number {
        return this.lastItem.endMillis - this.firstItem.startMillis;
    };

    hasStarted(t: number): boolean {
        return this.firstItem.startMillis < t;
    }

    isOver(t: number): boolean {
        return t > this.lastItem.endMillis;
    }

    isRunning(t: number): boolean {
        return this.hasStarted(t) && !this.isOver(t);
    }

    add(...items: AnimationItem[]) {
        this.items = [...this.items, ...items];
    }

    render(t: number) {
        this.items.forEach(item => item.render(t))
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