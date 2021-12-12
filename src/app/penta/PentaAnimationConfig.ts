import { Penta } from "./Penta";
import { PentaMan } from "./PentaMan";
import { PaintStyle } from "comicvm-dom";
import { SVGLine } from "../svg";
import { ShapeAnimationSectionConfig } from "../anim/animations/ShapeAnimationSection";

export interface PentaAnimationConfig extends ShapeAnimationSectionConfig<SVGLine> {
    penta?: Penta | PentaMan
    pentaMan?: PentaMan
    pentaStyle?: PentaStyleConfig
}

export interface PentaStyleConfig {
    none: PaintStyle
    inkOnPaper?: PaintStyle
    pentaBodyFill?: PaintStyle
    pentagramLine?: PaintStyle
    pentagramSpot?: PaintStyle
    centralLine?: PaintStyle
    centralSpot?: PaintStyle
    outerSpot?: PaintStyle
    innerSpot?: PaintStyle
    topDownPentagon: PaintStyle
}

export const PENTA_COLORS = {
    none: "transparent",
    white: "white",
    inkOnPaper: "rgba(100, 50, 35, 1)",
    pentaBody: "rgba(255, 190, 10, 0.3)",
    pentagram: "rgba(165, 60, 0, 1)",
    central: "rgba(255, 255, 0, 0.9)",
    topDownPentagon: "rgba(60, 160, 250, 1)",
}

export const PENTA_STYLES: PentaStyleConfig = {
    none: PaintStyle.fillAndStroke(PENTA_COLORS.none, PENTA_COLORS.none),
    inkOnPaper: PaintStyle.fillAndStroke(PENTA_COLORS.none, PENTA_COLORS.inkOnPaper, 0.5),
    pentaBodyFill: PaintStyle.fill(PENTA_COLORS.pentaBody),
    pentagramLine: PaintStyle.stroke(PENTA_COLORS.pentagram, 3),
    centralLine: PaintStyle.stroke(PENTA_COLORS.central, 3),
    pentagramSpot: PaintStyle.fillAndStroke(PENTA_COLORS.central, PENTA_COLORS.pentagram, 2),
    centralSpot: PaintStyle.fillAndStroke(PENTA_COLORS.white, PENTA_COLORS.central, 2),
    topDownPentagon: PaintStyle.fillAndStroke(PENTA_COLORS.topDownPentagon, PENTA_COLORS.topDownPentagon, 3),
}
