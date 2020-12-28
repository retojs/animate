import { Line, Point } from "comicvm-geometry-2d"

export const GOLDEN_RELATION = (1.0 + Math.sqrt(5)) * 0.5;

export class Penta {

    center: Point
    radius: number

    middle: Point

    overhead: Point
    handLeft: Point
    handRight: Point
    footLeft: Point
    footRight: Point

    head: Point
    elbowLeft: Point
    elbowRight: Point
    kneeLeft: Point
    kneeRight: Point

    upperArms: Line
    leftSide: Line
    rightSide: Line
    leftExt: Line
    rightExt: Line

    shoulderLeft: Point
    shoulderRight: Point
    hipLeft: Point
    hipRight: Point
    pubis: Point

    spine: Line
    armLeft: Line
    armRight: Line
    legLeft: Line
    legRight: Line

    neck: Point
    scapulaLeft: Point
    scapulaRight: Point
    ischiumLeft: Point
    ischiumRight: Point

    hips: Line
    leftTorso: Line
    rightTorso: Line
    leftRibs: Line
    rightRibs: Line

    heart: Point
    lungLeft: Point
    lungRight: Point
    kidneyLeft: Point
    kidneyRight: Point

    constructor(x: number, y: number, radius: number) {
        this.center = new Point(x, y)
        this.radius = radius

        this.middle = this.center

        let edges = Penta.getEdges(this.center, this.radius)

        this.head = edges[0]
        this.elbowLeft = edges[1]
        this.kneeLeft = edges[2]
        this.kneeRight = edges[3]
        this.elbowRight = edges[4]

        edges = Penta.getEdges(this.center, this.radius * GOLDEN_RELATION)

        this.overhead = edges[0]
        this.handLeft = edges[1]
        this.footLeft = edges[2]
        this.footRight = edges[3]
        this.handRight = edges[4]

        this.upperArms = new Line(this.elbowLeft, this.elbowRight)
        this.leftSide = new Line(this.head, this.kneeLeft)
        this.rightSide = new Line(this.head, this.kneeRight)
        this.leftExt = new Line(this.elbowLeft, this.kneeRight)
        this.rightExt = new Line(this.elbowRight, this.kneeLeft)

        this.shoulderLeft = this.upperArms.intersection(this.leftSide)
        this.shoulderRight = this.upperArms.intersection(this.rightSide)
        this.hipLeft = this.leftExt.intersection(this.leftSide)
        this.hipRight = this.rightExt.intersection(this.rightSide)
        this.pubis = this.leftExt.intersection(this.rightExt)

        this.spine = new Line(this.pubis, this.head)
        this.armLeft = new Line(this.hipRight, this.elbowLeft)
        this.armRight = new Line(this.hipLeft, this.elbowRight)
        this.legLeft = new Line(this.shoulderRight, this.kneeLeft)
        this.legRight = new Line(this.shoulderLeft, this.kneeRight)

        this.neck = this.spine.intersection(this.upperArms)
        this.scapulaLeft = this.armLeft.intersection(this.leftSide)
        this.scapulaRight = this.armRight.intersection(this.rightSide)
        this.ischiumLeft = this.legLeft.intersection(this.leftExt)
        this.ischiumRight = this.legRight.intersection(this.rightExt)

        this.hips = new Line(this.hipLeft, this.hipRight)
        this.leftTorso = new Line(this.shoulderLeft, this.pubis)
        this.rightTorso = new Line(this.shoulderRight, this.pubis)
        this.leftRibs = new Line(this.shoulderLeft, this.hipRight)
        this.rightRibs = new Line(this.shoulderRight, this.hipLeft)

        this.heart = this.leftRibs.intersection(this.rightRibs)
        this.lungLeft = this.leftTorso.intersection(this.rightRibs)
        this.lungRight = this.rightTorso.intersection(this.leftRibs)
        this.kidneyLeft = this.leftTorso.intersection(this.hips)
        this.kidneyRight = this.rightTorso.intersection(this.hips)
    }

    static getEdges(center: Point, radius: number) {
        return [0, 1, 2, 3, 4]
            .map(i => i * 2 * Math.PI / 5 + Math.PI / 2)
            .map(angle => new Point(
                center.x + Math.cos(-angle) * radius,
                center.y + Math.sin(-angle) * radius
            ))
    }
}