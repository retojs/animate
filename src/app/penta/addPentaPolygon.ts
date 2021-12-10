import { SVGPolygon } from "../svg";
import { PentaAnimationConfig } from "./PentaAnimationConfig";

export function addPentaPolygon({penta, style, svg}: PentaAnimationConfig): void {

    svg.add(SVGPolygon.fromPoints([
            penta.head,
            penta.shoulderLeft,
            penta.pubis,
            penta.shoulderRight,
        ],
        style.pentaBodyFill,
        svg)
    )

    svg.add(SVGPolygon.fromPoints([
            penta.shoulderRight,
            penta.hipLeft,
            penta.kneeLeft,
            penta.pubis,
        ],
        style.pentaBodyFill,
        svg)
    )
    svg.add(SVGPolygon.fromPoints([
            penta.shoulderLeft,
            penta.hipRight,
            penta.kneeRight,
            penta.pubis,
        ],
        style.pentaBodyFill,
        svg)
    )

    svg.add(SVGPolygon.fromPoints([
            penta.shoulderRight,
            penta.elbowRight,
            penta.scapulaRight,
            penta.lungRight,
        ],
        style.pentaBodyFill,
        svg)
    )

    svg.add(SVGPolygon.fromPoints([
            penta.shoulderLeft,
            penta.elbowLeft,
            penta.scapulaLeft,
            penta.lungLeft,
        ],
        style.pentaBodyFill,
        svg)
    )
}