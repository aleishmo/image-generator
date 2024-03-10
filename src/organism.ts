import { Circle } from './circle.js';

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
      const radius = circle.radius * (width * .25) / 255

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
}
