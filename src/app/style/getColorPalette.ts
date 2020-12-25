export function getColorPalette(
    colorCount: number,
    offset: number = 0,
    colorComponentOffsets: number[] = [0, 85, 170], // [R, G, B]
    colorComponentAmplitude: number[] = [255, 255, 255], // [R, G, B]
    colorComponentMin: number[] = [0, 0, 0], // [R, G, B]
): string[] {

    const red = colorComponentAmplitude[0]
    const green = colorComponentAmplitude[1]
    const blue = colorComponentAmplitude[2]

    const redOffset = (offset + colorComponentOffsets[0]) / 255 * Math.PI * 2
    const greenOffset = (offset + colorComponentOffsets[1]) / 255 * Math.PI * 2
    const blueOffset = (offset + colorComponentOffsets[2]) / 255 * Math.PI * 2

    const colorComponents = Array.from(Array(colorCount).keys())
        .map(i => i * 2 * Math.PI / colorCount)
        .map(angle => {

                // map cos function's value range [-1..1] to color component value range [0..255]

                const r = colorComponentMin[0] + (red / 2) + red * Math.cos(angle + redOffset)
                const g = colorComponentMin[1] + (green / 2) + green * Math.cos(angle + greenOffset)
                const b = colorComponentMin[2] + (blue / 2) + blue * Math.cos(angle + blueOffset)

                return [
                    Math.round(Math.max(0, Math.min(255, r))),
                    Math.round(Math.max(0, Math.min(255, g))),
                    Math.round(Math.max(0, Math.min(255, b))),
                ]
            }
        )

    return colorComponents.map(c => `rgba(${c[0]}, ${c[1]}, ${c[2]}, 1)`)
}