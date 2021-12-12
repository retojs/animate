import { SVGShape } from "../../../svg";
import { styleAnimationFactoryMixin } from "./mixins/styleAnimationFactoryMixin";
import { lineAnimationFactoryMixin } from "./mixins/lineAnimationFactoryMixin";
import { circleAnimationFactoryMixin } from "./mixins/circleAnimationFactoryMixin";
import { ShapeAnimationSectionConfig } from "../ShapeAnimationSection";
import { ShapeAnimationFactory } from "./ShapeAnimationFactory";

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

export function createAnimationFactory(config: ShapeAnimationSectionConfig<SVGShape>) {
    const FactoryClass = createFactoryClass()
    return new FactoryClass(config);
}