import { ColorPalette } from "./ColorPalette";

export function blendColors(source: string, target: string, progress: number) {
    const src: number[] = ColorPalette.colorFromString(source)
    const dst: number[] = ColorPalette.colorFromString(target)
    return ColorPalette.colorToString(
        src[0] + (dst[0] - src[0]) * progress,
        src[1] + (dst[1] - src[1]) * progress,
        src[2] + (dst[2] - src[2]) * progress,
        src[3] + (dst[3] - src[3]) * progress,
    )
}