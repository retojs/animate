import { Line, Point } from "comicvm-geometry-2d"

export default class Penta {

    center: Point

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

    constructor(x: number, y: number, radius: number) {
        this.center = new Point(x, y);

        const edges = [0, 1, 2, 3, 4]
            .map(i => i * 2 * Math.PI / 5 + Math.PI / 2)
            .map(angle => new Point(
                x + Math.cos(-angle) * radius,
                y + Math.sin(-angle) * radius
            ))

        this.head = edges[0]
        this.elbowLeft = edges[1]
        this.kneeLeft = edges[2]
        this.kneeRight = edges[3]
        this.elbowRight = edges[4]

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
    }
}