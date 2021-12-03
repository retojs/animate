import { Div, InputType, InputWithLabel, PaintStyle } from "comicvm-dom";
import { SVG, SVGCircle, SVGLine, SVGText } from "../../svg";
import { Animator } from "../Animator";
import { Animation } from "../Animation";
import { ColorPalette } from "../../style";
import { createAnimationFactory } from "./factories/createAnimationFactory";
import { Circle, Line } from "comicvm-geometry-2d";


const DEFAULT_DURATION = 1000
const STARTOVER_DELAY = 500

const color = ColorPalette.getColors()

const textStyle = PaintStyle.fill(color.val4.hue12)
const circleStyle = PaintStyle.fillAndStroke(color.val8.sat5.hue11, color.val3.sat9.hue13, 3)
const lineStyle = PaintStyle.fillAndStroke(color.val3.sat8.hue2, color.val3.sat8.hue2, 3)

export function createSVGAnimationDemo(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 400,
    })

    const animation = new Animation()

    const animationFactory = createAnimationFactory({
        svg,
        parent: animation,
        duration: DEFAULT_DURATION,
    })

    const circle = new SVGCircle(150, 200, 80, circleStyle, svg)
    const movedCircle = new Circle(450, 200, 40);
    const movedSVGCircle = SVGCircle.fromCircle(movedCircle, circleStyle, svg)

    animation.appendAll(0, [
        animationFactory.createSection({shape: circle}),
        animationFactory.createSection({
            shape: new SVGText(300, 100, "Show Shape", 0, textStyle, svg),
        }),
    ], [
        animationFactory.createMoveCircle(movedCircle, {shape: circle.evolve()}),
        animationFactory.createSection({
            shape: new SVGText(300, 100, "Move Circle", 0, textStyle, svg)
        })
    ], [
        animationFactory.createMoveCircle(new Circle(300, 100, 2), {shape: movedSVGCircle}),
        animationFactory.createStyleChange(lineStyle, {shape: movedSVGCircle}),
        animationFactory.createSection({
            shape: new SVGText(300, 100, "Shrink and Style Change", 0, textStyle, svg)
        })
    ], [
        animationFactory.createDrawLine({
            shape: new SVGLine(300, 100, 150, 300, lineStyle, svg)
        }),
        animationFactory.createSection({
            shape: new SVGText(300, 100, "Draw Line", 0, textStyle, svg)
        })
    ], [
        animationFactory.createDrawLineReverse({
            shape: new SVGLine(300, 100, 150, 300, lineStyle, svg)
        }),
        animationFactory.createDrawLine({
            shape: new SVGLine(150, 300, 350, 280, lineStyle, svg)
        }),
        animationFactory.createSection({
            shape: new SVGText(300, 100, "Draw Line (reverse)", 0, textStyle, svg)
        })
    ], [
        animationFactory.createMoveLine(
            Line.fromCoordinates(100, 100, 500, 100), {
                shape: new SVGLine(150, 300, 350, 280, lineStyle, svg)
            }
        ),
        animationFactory.createSection({
            shape: new SVGText(300, 100, "Move Line", 0, textStyle, svg)
        })
    ])

    animation.log()

    const animator = new Animator(animation, {
        name: "Shape Animations",
        repeatDelay: STARTOVER_DELAY,
        mouseWheelAnimate: svg.htmlElement
    })

    animator.start()

    const timeInput = InputWithLabel.createArrowKeyInput({
        type: InputType.NUMBER,
        text: "time",
        value: 0,
        onKeyUp: value => animator.render(value)
    });

    return Div.create({container, styleClass: "demo"})
        .append(`<h2>${animator.name}</h2>`)
        .append(svg)
    //   .append(timeInput)
}
