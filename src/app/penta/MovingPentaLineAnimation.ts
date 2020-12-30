import { Animation } from "../anim";
import { PentaManRelation } from "./PentaManRelation";
import { MovingPentaLineAnimationSection } from "./MovingPentaLineAnimationSection";

export class MovingPentaLineAnimation extends Animation {

    static fromConnectedLineAnimation(
        animation: Animation,
        relation: PentaManRelation,
        startMillis = 0,
        endMillis = 0
    ) {
        return new MovingPentaLineAnimation(
            MovingPentaLineAnimationSection.fromConnectedLineAnimation(
                animation,
                relation,
                startMillis,
                endMillis
            )
        )
    }

    static fromLineAnimation(
        animation: Animation,
        relation: PentaManRelation,
        startMillis = 0,
        endMillis = 0
    ) {
        return new MovingPentaLineAnimation(
            MovingPentaLineAnimationSection.fromLineAnimation(
                animation,
                relation,
                startMillis,
                endMillis
            ))
    }

    private constructor(
        ...parts: MovingPentaLineAnimationSection[]
    ) {
        super(...parts);
    }
}