import { PaintStyle } from "comicvm-dom";
import { Line, Point } from "comicvm-geometry-2d"
import { SVG, SVGCircle, SVGImage } from "../svg"

export class PentaMan {

    center: Point

    svg: SVG
    svgImage: SVGImage
    imagePath = "Vitruvian_Man_by_Leonardo_da_Vinci.jpg"

    nativeImageWidth = 4196
    nativeImageHeight = 5671
    originalImageWidth = 500
    scaledImageWidth = 500
    imageOffsetX = 50
    imageOffsetY = -10

    middle: Point

    head: Point
    elbowLeft: Point
    elbowRight: Point
    kneeLeft: Point
    kneeRight: Point

    overhead: Point
    handLeft: Point
    handRight: Point
    footLeft: Point
    footRight: Point

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

    constructor(x: number, y: number, width: number) {
        this.setup(x, y, width)
    }

    setup(x: number, y: number, width: number) {
        this.center = new Point(x, y)
        this.scaledImageWidth = width
        this.imageOffsetX = this.center.x - width / 2
        this.imageOffsetY = this.center.y - width * (this.nativeImageHeight / this.nativeImageWidth) / 2

        console.log("PentaMan.center :", this.center)
        console.log("PentaMan.scaledImageWidth :", this.scaledImageWidth)
        console.log("PentaMan.scaledImageOffsetX :", this.imageOffsetX)
        console.log("PentaMan.scaledImageOffsetY :", this.imageOffsetY)

        this.middle = this.getPoint(0, -71)

        this.head = this.getPoint(0, -171)
        this.elbowLeft = this.getPoint(-100, -125)
        this.elbowRight = this.getSymmetricPoint(this.elbowLeft)
        this.kneeLeft = this.getPoint(-60, 70)
        this.kneeRight = this.getSymmetricPoint(this.kneeLeft)

        this.overhead = this.getPoint(0, -207)
        this.handLeft = this.getPoint(-180, -130)
        this.footLeft = this.getPoint(-115, 165)
        this.footRight = this.getSymmetricPoint(this.footLeft)
        this.handRight = this.getSymmetricPoint(this.handLeft)

        this.pubis = this.getPoint(0, 0) //new Point(this.center.x, this.center.y + 5)
        this.hipLeft = this.getPoint(-30, -40) //new Point(this.center.x - 28, this.center.y - 40)
        this.hipRight = this.getSymmetricPoint(this.hipLeft)
        this.shoulderLeft = this.getPoint(-35, -140) //new Point(this.center.x - 30, this.center.y - 140)
        this.shoulderRight = this.getSymmetricPoint(this.shoulderLeft)

        this.spine = new Line(this.pubis, this.head)
        this.armLeft = new Line(this.hipRight, this.elbowLeft)
        this.armRight = new Line(this.hipLeft, this.elbowRight)
        this.legLeft = new Line(this.shoulderRight, this.kneeLeft)
        this.legRight = new Line(this.shoulderLeft, this.kneeRight)

        this.neck = this.getPoint(0, -145) //new Point(this.center.x, this.center.y - 145)
        this.scapulaLeft = this.getPoint(-30, -105) // new Point(this.center.x - 30, this.center.y - 100)
        this.scapulaRight = this.getSymmetricPoint(this.scapulaLeft)
        this.ischiumLeft = this.getPoint(-20, -7) //new Point(this.center.x - 15, this.center.y - 10)
        this.ischiumRight = this.getSymmetricPoint(this.ischiumLeft)

        this.hips = new Line(this.hipLeft, this.hipRight)
        this.leftTorso = new Line(this.shoulderLeft, this.pubis)
        this.rightTorso = new Line(this.shoulderRight, this.pubis)
        this.leftRibs = new Line(this.shoulderLeft, this.hipRight)
        this.rightRibs = new Line(this.shoulderRight, this.hipLeft)

        this.heart = this.getPoint(0, -112) //this.getPoint(,) //new Point(this.center.x, this.center.y - 37)
        this.lungLeft = this.getPoint(-20, -80) //new Point(this.center.x - 18, this.center.y - 82)
        this.lungRight = this.getSymmetricPoint(this.lungLeft)
        this.kidneyLeft = this.getPoint(-10, -40) // new Point(this.center.x - 10, this.center.y - 40)
        this.kidneyRight = this.getSymmetricPoint(this.kidneyLeft)

        this.getImage()
    }

    getPoint(offsetX, offsetY) {
        return new Point(
            this.center.x + offsetX * this.scaledImageWidth / this.originalImageWidth,
            this.center.y + offsetY * this.scaledImageWidth / this.originalImageWidth
        )
    }

    getSymmetricPoint(p: Point) {
        return new Point(
            this.center.x + (this.center.x - p.x),
            p.y)
    }

    getImage(svg?: SVG): SVGImage {
        this.svg = svg || this.svg

        if (!this.svgImage) {
            this.svgImage = new SVGImage(
                this.imagePath,
                this.imageOffsetX,
                this.imageOffsetY,
                this.scaledImageWidth,
                Math.round(
                    this.scaledImageWidth * (this.nativeImageHeight / this.nativeImageWidth)
                ),
                this.svg
            )
        } else {
            this.svgImage.x = this.imageOffsetX
            this.svgImage.y = this.imageOffsetY
            this.svgImage.width = this.scaledImageWidth
            this.svgImage.height = Math.round(
                this.scaledImageWidth * (this.nativeImageHeight / this.nativeImageWidth)
            )
        }

        return this.svgImage
    }

    getPentagramSpots(radius: number, style: PaintStyle): SVGCircle[] {
        return [
            this.head,
            this.elbowLeft,
            this.elbowRight,
            this.kneeLeft,
            this.kneeRight,

            this.pubis,
            this.hipLeft,
            this.hipRight,
            this.shoulderLeft,
            this.shoulderRight,

            this.heart,
            this.lungLeft,
            this.lungRight,
            this.kidneyLeft,
            this.kidneyRight,

        ].map((point: Point) =>
            new SVGCircle(point.x, point.y, radius, style)
        )
    }

    getCentralSpots(radius: number, style: PaintStyle): SVGCircle[] {
        return [
            this.middle,

            this.neck,
            this.scapulaLeft,
            this.scapulaRight,
            this.ischiumLeft,
            this.ischiumRight,

            this.overhead,
            this.handLeft,
            this.handRight,
            this.footLeft,
            this.footRight,

        ].map(point =>
            new SVGCircle(point.x, point.y, radius, style)
        )
    }
}