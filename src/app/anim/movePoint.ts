import { Point } from "comicvm-geometry-2d";
import { interpolateValue } from "./interpolateValue";

export function movePoint(srcX: number, srcY: number, targetX: number, targetY: number, progress: number): Point {
    return new Point(
        interpolateValue(srcX, targetX, progress),
        interpolateValue(srcY, targetY, progress)
    )
}
