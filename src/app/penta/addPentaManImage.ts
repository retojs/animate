import { SVGCircle } from "../svg";
import { Penta } from "./Penta";
import { PENTA_STYLES, PentaAnimationConfig } from "./PentaAnimationConfig";

export function addPentaManImage({penta, pentaMan, svg}: PentaAnimationConfig) {
    svg.add(
        pentaMan.getImage(svg, 0.5),
        new SVGCircle(penta.center.x, penta.center.y, (penta as Penta).radius, PENTA_STYLES.inkOnPaper),
        new SVGCircle(penta.center.x, penta.center.y, 77, PENTA_STYLES.inkOnPaper),
        new SVGCircle(penta.center.x, penta.center.y, 29, PENTA_STYLES.inkOnPaper)
    )
}
