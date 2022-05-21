import { Div, PaintStyle } from "comicvm-dom"
import { SVG } from "../SVG"
import { SVGRect } from "../SVGRect";
import { SVGCircle } from "../SVGCircle";
import { Animation, Animator, RadiusAnimationSection } from "../../anim";


export function createSVGDemo(container): Div {

    const styles = {
        rectOne: PaintStyle.fill("#99eeee"),
        rectTwo: PaintStyle.fill("#99ffff"),
        circleOne: PaintStyle.fillAndStroke("rgba(255, 220, 30, 0.7)", "rgba(220, 40, 180, 1)", 4),
        circleTwo: PaintStyle.fillAndStroke("rgba(180, 255, 100, 0.7)", "rgba(0, 180, 120, 1)", 2)
    }

    const shapes = {
        rectOne: new SVGRect(95, 45, 410, 310, styles.rectOne),
        rectTwo: new SVGRect(100, 50, 400, 300, styles.rectTwo),
        circleOne: new SVGCircle(300, 200, 120, styles.circleOne),
        circleTwo: new SVGCircle(300, 200, 80, styles.circleTwo)
    }

    const animations = {
        bounceOne: RadiusAnimationSection.getBounce(shapes.circleOne, 3000, {startMillis: 0, duration: 11 * 3000}),
        bounceTwo: RadiusAnimationSection.getBounce(shapes.circleTwo, 2750, {startMillis: 0, duration: 12 * 2750})
    }

    const svg = SVG.create({
        width: 600,
        height: 400
    })

    svg.add(
        shapes.rectOne,
        shapes.rectTwo,
        shapes.circleOne,
        shapes.circleTwo
    )

    new Animator(
        new Animation(
            animations.bounceOne,
            animations.bounceTwo
        ), {
            name: "SVGs!",
            htmlElement: svg.htmlElement
        }
    ).start()

    return Div.create({container, styleClass: "demo"})
        .append("<h2>SVGs</h2>")
        .append(svg)
}
