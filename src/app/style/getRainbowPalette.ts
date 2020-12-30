export function getRainbowPalette(
    colorCount: number,
): string[] {

    // define the initial color of the color palette
    const initialColor = [255, 0, 0]
    // define which color components change by how much on 6 equal segments of the color palette
    const componentIncrements = [
        [0, 1, 0],
        [-1, 0, 0],
        [0, 0, 1],
        [0, -1, 0],
        [1, 0, 0],
        [0, 0, -1],
    ]

    const colorPalette: number[][] = Array.from(Array(colorCount).keys())
        .reduce((palette: number[][], index) => {
            const segment = Math.floor(index / (colorCount / 6))
            const increment = componentIncrements[segment]
            const lastColor = palette[palette.length - 1]
            const color = [
                lastColor[0] + increment[0] * 255 / (colorCount / 6),
                lastColor[1] + increment[1] * 255 / (colorCount / 6),
                lastColor[2] + increment[2] * 255 / (colorCount / 6),
            ]
            palette.push(color)

            return palette
        }, [initialColor])

    return colorPalette
        .map(([r, g, b]) => [Math.round(r), Math.round(g), Math.round(b)])
        .map(c => `rgba(${c[0]}, ${c[1]}, ${c[2]}, 1)`)
}