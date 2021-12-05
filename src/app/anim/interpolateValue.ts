export function interpolateValue(src: number, target: number, progress: number): number {
    const delta = (target - src) * progress

    return src + delta
}
