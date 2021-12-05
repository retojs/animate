import { applyMixins, createAnimationFactory } from "./createAnimationFactory";

type Constructor<T> = new (...args: any[]) => T

class MixinBase {
    value() {
        return 0
    }
}

const Mixin1 = function createMixin1<T extends Constructor<Object>>(BaseClass: T) {
    return class extends BaseClass {
        value() {
            return 1
        }

        value1() {
            return "x"
        }
    }
}

const Mixin2 = function createMixin2<T extends Constructor<{}>>(BaseClass: T) {
    return class extends BaseClass {
        value() {
            return 2
        }

        value2() {
            return "y"
        }
    }
}

describe("Mixins", () => {
    test("are abstract subclasses. They add methods to any base class.", () => {
        const Mixin1Class = Mixin1(MixinBase);
        let object1 = new Mixin1Class()
        expect(object1.value()).toBe(1)

        const Mixin2Class = Mixin2(MixinBase);
        let object2 = new Mixin2Class()
        expect(object2.value()).toBe(2)

        // mind the operator precedence!
        object1 = new (Mixin1(MixinBase))()
        expect(object1.value()).toBe(1)
        object2 = new (Mixin2(MixinBase))()
        expect(object2.value()).toBe(2)
    })
})

describe("applyMixins", () => {
    test("applies a list of mixins to a base class", () => {
        const MixinClass = applyMixins(MixinBase, Mixin1, Mixin2)
        let object = new MixinClass()
        expect(object.value()).toBe(2)
        expect(object.value1()).toBe("x")
        expect(object.value2()).toBe("y")
    })
})

describe("createFactory", () => {
    test("creates a SVGShapeAnimationFactory", () => {
        const factory = createAnimationFactory({})

        expect(factory.getAnimationConfig).toBeDefined()
        expect(factory.createShape).toBeDefined()
        expect(factory.addShape).toBeDefined()
        expect(factory.applyShape).toBeDefined()

        expect(factory.validateStyles).toBeDefined()
        expect(factory.createStyleChange).toBeDefined()
        expect(factory.addStyleChange).toBeDefined()
        expect(factory.applyStyleChange).toBeDefined()

        expect(factory.createCircle).toBeDefined()
        expect(factory.createMoveCircle).toBeDefined()
        expect(factory.addMoveCircle).toBeDefined()
        expect(factory.applyMoveCircle).toBeDefined()

        expect(factory.createLine).toBeDefined()
        expect(factory.createDrawLine).toBeDefined()
        expect(factory.addDrawLine).toBeDefined()
        expect(factory.applyDrawLine).toBeDefined()
    })
})
