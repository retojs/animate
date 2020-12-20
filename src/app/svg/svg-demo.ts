import { Div, PaintStyle } from "comicvm-dom"
import { SVG } from "./SVG"
import { SVGRect } from "./SVGRect";
import { SVGCircle } from "./SVGCircle";
import { Animation, Animator, CirclePulseAnimationItem } from "../anim";

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
        PaintStyle.fillAndStroke("#ffe32b", "#d130ae", 4)
    )
    let circle2 = new SVGCircle(300, 200, 80,
        PaintStyle.fillAndStroke("#b0ff66", "#00bd81", 2)
    )

    svg.add(
        circle1,
        circle2
    )

    new Animator("SVGs").start(new Animation(
        new CirclePulseAnimationItem(circle1, 0, 10 * 1000),
        new CirclePulseAnimationItem(circle2, 60, 10 * 1000)
    ))

    return Div.create({container})
        .append("<h2>SVGs</h2>")
        .append(svg)
}
