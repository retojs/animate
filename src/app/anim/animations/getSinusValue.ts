export function getSinusValue(startMillis: number, time: number, interval: number = 1000) {
    const dt = time - startMillis
    const value = 0.5 * (1 + Math.cos(dt / interval * Math.PI * 2))
    return Math.max(0, Math.min(1, value))
}