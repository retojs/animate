import { PaintStyle } from "comicvm-dom";
import { DrawingLineAnimation, DrawingLineAnimationSection } from "../anim"
import { SVGLine } from "../svg";
import { PentaManAnimationGenerator } from "./PentaManAnimationGenerator"
import { PentaMan } from "./PentaMan"
import { Penta } from "./Penta"

describe("PentaManAnimationGenerator.ts", () => {

    let line1: SVGLine
    let line2: SVGLine
    let lineStyle1: PaintStyle
    let lineStyle2: PaintStyle
    let lineStyle3: PaintStyle
    let lineStyle4: PaintStyle
    let section1: DrawingLineAnimationSection
    let section2: DrawingLineAnimationSection
    let animation: DrawingLineAnimation
    let pentaMan: PentaMan
    let penta: Penta
    let generator: PentaManAnimationGenerator

    beforeEach(() => {
        lineStyle1 = PaintStyle.fillAndStroke("#111", "#123")
        lineStyle2 = PaintStyle.fillAndStroke("#222", "#234")
        lineStyle3 = PaintStyle.fillAndStroke("#333", "#345")
        lineStyle4 = PaintStyle.fillAndStroke("#444", "#456")
        line1 = new SVGLine(0, 0, 100, 100, lineStyle1)
        line2 = new SVGLine(20, 20, 120, 120, lineStyle2)
        section1 = new DrawingLineAnimationSection({shape:line1, startMillis: 0, duration: 1000})
        section2 = new DrawingLineAnimationSection({shape:line2, startMillis: 0, duration: 1000})
        animation = new DrawingLineAnimation({startMillis: 0, duration: 1000}, section1, section2)
        penta = new Penta(0, 0, 100)
        pentaMan = new PentaMan(0, 0, 100)
        generator = new PentaManAnimationGenerator(animation, pentaMan, penta)
    })

    test(".replaceLineStyle() replaces styles in LineAnimationSections", () => {
        expect(line1.style).toEqual(lineStyle1)
        expect(line2.style).toEqual(lineStyle2)
        generator.replaceLineStyle(animation, lineStyle1, lineStyle3, lineStyle2, lineStyle4)
        expect(line1.style).toEqual(lineStyle3)
        expect(line2.style).toEqual(lineStyle4)
    })
})