import { Color } from './color.js'
import { getRandomUnsignedByte } from './getRandomUnsignedByte.js'
import { ByteArrayReader } from './byteArrayReader.js'

export class Circle {
  constructor(
    public color = new Color(),

    /**
     * Expressed as percentage of a quarter of the image width (integer between 0 and 255)
     */
    public radius = getRandomUnsignedByte(),

    /**
     * Expressed as percentage of image width (integer between 0 and 255)
     */
    public x = getRandomUnsignedByte(),

    /**
     * Expressed as percentage of image height (integer between 0 and 255)
     */
    public y = getRandomUnsignedByte()
  ) {
  }

  toByteArray(): Uint8ClampedArray {
    return new Uint8ClampedArray([this.radius, this.x, this.y, ...this.color.toByteArray()])
  }

  static fromReader(reader: ByteArrayReader) {
    const radius = reader.readByte()
    const x = reader.readByte()
    const y = reader.readByte()
    const color = Color.fromReader(reader)
    const circle = new Circle(color, radius, x, y)
    return circle
  }
}
