import { SVG, SVGRect } from "../svg";
import { PaintStyle } from "comicvm-dom";

export function colorPaletteToSVG(
    colors: string[],
    svg: SVG,
    x = 20,
    y = 20,
    width = 20,
    height = 20,
): SVGRect[] {

    return colors.map((color, i) =>
        new SVGRect(
            x + i * width,
            y,
            width,
            height,
            PaintStyle.fill(color),
            svg
        )
    )
}