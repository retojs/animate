import { PaintStyle } from "comicvm-dom";

export { ColorPalette, Colors, ColorHue, ColorValue, ColorSaturation } from "./ColorPalette"
export { getColorPalette } from "./getColorPalette"
export { colorPaletteToSVG } from "./colorPaletteToSVG"
export { getRainbowPalette } from "./getRainbowPalette"

export { colorPaletteDemo } from "./demos/color-palette-demo"
export { rainbowPaletteDemo } from "./demos/rainbow-palette-demo"

export const DEFAULT_STYLE = {
    fillStyle: PaintStyle.fill("blue"),
    strokeStyle: PaintStyle.stroke("black"),
}