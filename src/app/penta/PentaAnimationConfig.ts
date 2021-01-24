import { Penta } from "./Penta";
import { PentaMan } from "./PentaMan";
import { PaintStyle } from "comicvm-dom";
import { SVG } from "../svg";

export interface PentaAnimationConfig {
    penta?: Penta | PentaMan
    pentaMan?: PentaMan
    svg?: SVG
    startMillis?: number
    duration?: number
    style?: PentaStyleConfig
}

export interface PentaStyleConfig {
    pentagramLine?: PaintStyle,
    centralLine?: PaintStyle,
    pentagramSpot?: PaintStyle,
    centralSpot?: PaintStyle,
    outerSpot?: PaintStyle,
    innerSpot?: PaintStyle,
}