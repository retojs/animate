import { ShapeAnimationConfig } from "../ShapeAnimationConfig";
import { styleAnimationFactoryMixin } from "./mixins/styleAnimationFactoryMixin";
import { lineAnimationFactoryMixin } from "./mixins/lineAnimationFactoryMixin";
import { circleAnimationFactoryMixin } from "./mixins/circleAnimationFactoryMixin";
import { ShapeAnimationFactory } from "./ShapeAnimationFactory";
import { SVGShape } from "../../../svg";

/**
 * This function creates a class that extends the specified base class with all mixins
 *
 * @param base class
 * @param mixins
 */
export function applyMixins(base, ...mixins) {
    return mixins.reduce((factory, mixin) => mixin(factory), base)
}

export function createFactoryClass() {
    return applyMixins(
        ShapeAnimationFactory,
        styleAnimationFactoryMixin,
        lineAnimationFactoryMixin,
        circleAnimationFactoryMixin,
    )
}

export function createAnimationFactory(config: ShapeAnimationConfig<SVGShape>) {
    const FactoryClass = createFactoryClass()
    return new FactoryClass(config);
}