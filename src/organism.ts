import { Circle } from './circle.js';
import { ByteArrayReader } from './byteArrayReader.js';

export type OrganismRenderOptions = {
  context: CanvasRenderingContext2D
  width: number
  height: number
}

export class Organism {
  circles: Circle[] = []

  constructor(circleCount: number) {
    for (let i = 0; i < circleCount; i++) {
      const circle = new Circle()
      this.circles.push(circle)
    }
  }

  render(options: OrganismRenderOptions) {
    const { context, width, height } = options

    context.clearRect(0, 0, width, height)

    this.circles.forEach((circle) => {
      const x = circle.x * width / 255
      const y = circle.y * height / 255
      const radius = circle.radius * (width * .5) / 255

      context.save()
      try {
        context.beginPath()
        context.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI)
        context.closePath()
        context.fillStyle = circle.color.toString()
        context.globalAlpha = circle.color.opacity / 255
        context.fill()
      } finally {
        context.restore()
      }
    })

    context.globalAlpha = 1
  }

  toByteArray(): Uint8ClampedArray {
    return new Uint8ClampedArray([...this.circles.flatMap((circle) => [...circle.toByteArray()])])
  }

  static fromReader(reader: ByteArrayReader) {
    const organism = new Organism(0)
    while (!reader.hasReachedEnd()) {
      organism.circles.push(Circle.fromReader(reader))
    }
    return organism
  }

  clone() {
    const newOrganism = new Organism(0)
    for (const circle of this.circles) {
      newOrganism.circles.push(new Circle(circle.color, circle.radius, circle.x, circle.y))
    }
    return newOrganism
  }
}
