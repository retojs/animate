import { SVGPolygon } from "../svg";
import { PentaAnimationConfig } from "./PentaAnimationConfig";

export function addPentaPolygon({penta, pentaStyle, svg}: PentaAnimationConfig): void {

    svg.add(SVGPolygon.fromPoints([
            penta.head,
            penta.shoulderLeft,
            penta.pubis,
            penta.shoulderRight,
        ],
        pentaStyle.pentaBodyFill,
        svg)
    )

    svg.add(SVGPolygon.fromPoints([
            penta.shoulderRight,
            penta.hipLeft,
            penta.kneeLeft,
            penta.pubis,
        ],
        pentaStyle.pentaBodyFill,
        svg)
    )
    svg.add(SVGPolygon.fromPoints([
            penta.shoulderLeft,
            penta.hipRight,
            penta.kneeRight,
            penta.pubis,
        ],
        pentaStyle.pentaBodyFill,
        svg)
    )

    svg.add(SVGPolygon.fromPoints([
            penta.shoulderRight,
            penta.elbowRight,
            penta.scapulaRight,
            penta.lungRight,
        ],
        pentaStyle.pentaBodyFill,
        svg)
    )

    svg.add(SVGPolygon.fromPoints([
            penta.shoulderLeft,
            penta.elbowLeft,
            penta.scapulaLeft,
            penta.lungLeft,
        ],
        pentaStyle.pentaBodyFill,
        svg)
    )
}