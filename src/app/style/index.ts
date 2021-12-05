import { PaintStyle } from "comicvm-dom";

export { colorPaletteDemo } from "./demos/color-palette-demo"
export { ColorPalette, Colors, ColorHue, ColorValue, ColorSaturation } from "./ColorPalette"
export { colorPaletteToSVG } from "./colorPaletteToSVG"
export { getColorPalette } from "./getColorPalette"
export { getRainbowPalette } from "./getRainbowPalette"
export { rainbowPaletteDemo } from "./demos/rainbow-palette-demo"

export const DEFAULT_STYLE = {
    fillStyle: PaintStyle.fill("blue"),
    strokeStyle: PaintStyle.stroke("black"),
}