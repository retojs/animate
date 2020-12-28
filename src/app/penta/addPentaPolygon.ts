import { PaintStyle } from "comicvm-dom";
import { SVG, SVGPolygon } from "../svg";
import { Penta } from "./Penta";
import { PentaMan } from "./PentaMan";

export function addPentaPolygon(penta: (Penta | PentaMan), style: PaintStyle, svg: SVG): void {

    svg.add(SVGPolygon.fromPoints([
            penta.head,
            penta.shoulderLeft,
            penta.elbowLeft,
            penta.scapulaLeft,
            penta.middle,
            penta.hipRight,
            penta.kneeRight,
            penta.pubis
        ],
        style,
        svg)
    )

    svg.add(SVGPolygon.fromPoints([
            penta.head,
            penta.shoulderRight,
            penta.elbowRight,
            penta.scapulaRight,
            penta.middle,
            penta.hipLeft,
            penta.kneeLeft,
            penta.pubis
        ],
        style,
        svg)
    )

    svg.add(SVGPolygon.fromPoints([
            penta.shoulderLeft,
            penta.pubis,
            penta.shoulderRight,
        ],
        style,
        svg)
    )
}