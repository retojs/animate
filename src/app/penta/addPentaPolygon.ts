import { PaintStyle } from "comicvm-dom";
import { SVG, SVGPolygon } from "../svg";
import Penta from "./Penta";

export function addPentaPolygon(penta: Penta, style: PaintStyle, svg: SVG): void {
    svg.add(SVGPolygon.fromPoints([
            penta.head,
            penta.shoulderLeft,
            penta.elbowLeft,
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