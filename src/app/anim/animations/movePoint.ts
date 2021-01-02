import { Point } from "comicvm-geometry-2d";

export function movePoint(srcX: number, srcY: number, targetX: number, targetY: number, progress: number): Point {
    const dx = (targetX - srcX) * progress
    const dy = (targetY - srcY) * progress

    return new Point(srcX + dx, srcY + dy)
}
