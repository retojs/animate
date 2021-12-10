import { Div, PaintStyle } from "comicvm-dom"
import { SVG } from "../SVG"
import { SVGRect } from "../SVGRect";
import { SVGCircle } from "../SVGCircle";
import { Animation, Animator, RadiusAnimationSection } from "../../anim";

export function createSVGDemo(container): Div {

    const svg = SVG.create({
        width: 600,
        height: 400,
    })

    svg.add(
        new SVGRect(95, 45, 410, 310,
            PaintStyle.fill("#99eeee")
        ),
        new SVGRect(100, 50, 400, 300,
            PaintStyle.fill("#99ffff")
        ),
    )

    let circle1 = new SVGCircle(300, 200, 120,
        PaintStyle.fillAndStroke("rgba(255, 220, 30, 0.7)", "rgba(220, 40, 180, 1)", 4)
    )
    let circle2 = new SVGCircle(300, 200, 80,
        PaintStyle.fillAndStroke("rgba(180, 255, 100, 0.7)", "rgba(0, 180, 120, 1)", 2)
    )

    svg.add(
        circle1,
        circle2
    )

    new Animator(
        new Animation(
            RadiusAnimationSection.getBounce(circle1, 3000, {startMillis: 0, duration: 11 * 3000}),
            RadiusAnimationSection.getBounce(circle2, 2750, {startMillis: 0, duration: 12 * 2750})
        ), {
            name: "SVGs!",
            htmlElement: svg.htmlElement
        }
    ).start()

    return Div.create({container, styleClass: "demo"})
        .append("<h2>SVGs</h2>")
        .append(svg)
}
