import { Div, PaintStyle } from "comicvm-dom";
import { SVG } from "../../svg";
import { Animator } from "../Animator";
import { Animation } from "../Animation";
import { ColorPalette } from "../../style";
import { createAnimationFactory } from "./factories/createAnimationFactory";
import { Circle, Line, Point } from "comicvm-geometry-2d";

const color = ColorPalette.getColors()

export function createSVGShapeAnimationDemo(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 400,
    })

    const animation = new Animation()

    const animationFactory = createAnimationFactory({
        svg,
        parent: animation,
        duration: 1500,
    })

    const textStyle = PaintStyle.fill(color.val4.hue12)
    const textPos = new Point(50, 50);
    const svgText = {
        showShape: svg.newSVGText(textPos, "Show Shape", 0, textStyle),
        moveCircle: svg.newSVGText(textPos, "Move Circle", 0, textStyle),
        shrinkAndStyleChange: svg.newSVGText(textPos, "Shrink and Style Change", 0, textStyle),
        drawLine: svg.newSVGText(textPos, "Draw Line", 0, textStyle),
        drawLineReverse: svg.newSVGText(textPos, "Draw Line (reverse)", 0, textStyle),
        moveLine: svg.newSVGText(textPos, "Move Line", 0, textStyle)
    }

    const circleStyle = PaintStyle.fillAndStroke(color.val8.sat5.hue11, color.val3.sat9.hue13, 3)
    const circle = {
        a: new Circle(150, 200, 80),
        b: new Circle(450, 200, 40),
        c: new Circle(300, 100, 2),
    }
    const svgCircle1 = svg.newSVGCircle(circle.a, circleStyle)
    const svgCircle2 = svg.newSVGCircle(circle.b, circleStyle)

    const lineStyle = PaintStyle.fillAndStroke(color.val3.sat8.hue2, color.val3.sat8.hue2, 3)
    const svgLine = {
        a: svg.newSVGLineFromCoords(300, 100, 150, 300, lineStyle),
        b: svg.newSVGLineFromCoords(300, 100, 150, 300, lineStyle),
        c: svg.newSVGLineFromCoords(150, 300, 350, 300, lineStyle),
    }
    const line = Line.fromCoordinates(450, 300, 450, 70)

    animation.appendAll(0, [
        animationFactory.createSection({shape: svgCircle1}),
        animationFactory.createSection({shape: svgText.showShape}),
    ], [
        animationFactory.createMoveCircle(circle.b, {shape: svgCircle1.clone()}),
        animationFactory.createSection({shape: svgText.moveCircle})
    ], [
        animationFactory.createMoveCircle(circle.c, {shape: svgCircle2}),
        animationFactory.createStyleChange(lineStyle, {shape: svgCircle2}),
        animationFactory.createSection({shape: svgText.shrinkAndStyleChange})
    ], [
        animationFactory.createDrawLine({shape: svgLine.a}),
        animationFactory.createSection({shape: svgText.drawLine})
    ], [
        animationFactory.createDrawLineReverse({shape: svgLine.b}),
        animationFactory.createDrawLine({shape: svgLine.c}),
        animationFactory.createSection({shape: svgText.drawLineReverse})
    ], [
        animationFactory.createMoveLine(line, {shape: svgLine.c.clone()}),
        animationFactory.createSection({shape: svgText.moveLine})
    ])

    animation.log()

    const animator = new Animator(animation, {
        name: "Shape Animations",
        repeatDelay: 500,
        mouseWheelAnimate: svg.htmlElement
    })

    animator.start()

    return Div.create({container, styleClass: "demo"})
        .append(`<h2>${animator.name}</h2>`)
        .append(svg)
}
