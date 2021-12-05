import { Penta } from "./Penta";
import { PentaMan } from "./PentaMan";

/**
 * Translates the coordinates of a PentaMan point to the coordinates of the related Penta point.
 */
export class PentaManRelation {

    POINT_NAMES = [
        "middle",
        "head",
        "elbowLeft",
        "elbowRight",
        "kneeLeft",
        "kneeRight",
        "overhead",
        "handLeft",
        "handRight",
        "footLeft",
        "footRight",
        "shoulderLeft",
        "shoulderRight",
        "hipLeft",
        "hipRight",
        "pubis",
        "neck",
        "scapulaLeft",
        "scapulaRight",
        "ischiumLeft",
        "ischiumRight",
        "heart",
        "lungLeft",
        "lungRight",
        "kidneyLeft",
        "kidneyRight",
    ]

    LINE_NAMES = [
        "upperArms",
        "leftSide",
        "rightSide",
        "leftExt",
        "rightExt",
        "spine",
        "armLeft",
        "armRight",
        "legLeft",
        "legRight",
        "hips",
        "leftTorso",
        "rightTorso",
        "leftRibs",
        "rightRibs",
    ]

    constructor(
        public pentaMan: PentaMan,
        public penta: Penta
    ) {
    }

    getPentaPointName(x: number, y: number) {
        for (let name of this.POINT_NAMES) {
            const point = this.penta[name]
            if (point.x === x && point.y === y) {
                return name
            }
        }
    }

    getManPointName(x: number, y: number) {
        for (let name of this.POINT_NAMES) {
            const point = this.pentaMan[name]
            if (point.x === x && point.y === y) {
                return name
            }
        }
    }

    getManPoint(x: number, y: number) {
        return this.pentaMan[this.getPentaPointName(x, y)]
    }

    getPentaPoint(x: number, y: number) {
        return this.penta[this.getManPointName(x, y)]
    }
}