import { Animation } from "../anim";
import { PentaManRelation } from "./PentaManRelation";
import { MovingPentaLineAnimationSection } from "./MovingPentaLineAnimationSection";

export class MovingPentaLineAnimation extends Animation {

    static fromConnectedLineAnimation(
        animation: Animation,
        relation: PentaManRelation,
        startMillis: number = 0,
        interval: number
    ) {
        return new MovingPentaLineAnimation(
            MovingPentaLineAnimationSection.fromConnectedLineAnimation(
                animation,
                relation,
                startMillis,
                interval,
            )
        )
    }

    static fromLineAnimation(
        animation: Animation,
        relation: PentaManRelation,
        startMillis: number = 0,
        interval: number
    ) {
        return new MovingPentaLineAnimation(
            MovingPentaLineAnimationSection.fromLineAnimation(
                animation,
                relation,
                startMillis,
                interval
            ))
    }

    private constructor(
        ...parts: MovingPentaLineAnimationSection[]
    ) {
        super(...parts);
    }
}