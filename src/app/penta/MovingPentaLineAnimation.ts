import { Animation } from "../anim";
import { PentaManRelation } from "./PentaManRelation";
import { MovingPentaLineAnimationSection } from "./MovingPentaLineAnimationSection";

export class MovingPentaLineAnimation extends Animation {

    static fromConnectedLineAnimation(
        animation: Animation,
        relation: PentaManRelation,
        startMillis: number = 0,
        frequency: number
    ) {
        return new MovingPentaLineAnimation(
            MovingPentaLineAnimationSection.fromConnectedLineAnimation(
                animation,
                relation,
                startMillis,
                frequency,
            )
        )
    }

    static fromLineAnimation(
        animation: Animation,
        relation: PentaManRelation,
        startMillis: number = 0,
        frequency: number
    ) {
        return new MovingPentaLineAnimation(
            MovingPentaLineAnimationSection.fromLineAnimation(
                animation,
                relation,
                startMillis,
                frequency
            ))
    }

    private constructor(
        ...parts: MovingPentaLineAnimationSection[]
    ) {
        super(...parts);
    }
}