import { getRandomUnsignedByte } from './getRandomUnsignedByte.js'
import { assertIsUnsignedByte } from './assertIsUnsignedByte.js'

export class Color {
  constructor(
    public r = getRandomUnsignedByte(),
    public g = getRandomUnsignedByte(),
    public b = getRandomUnsignedByte(),
    public opacity = getRandomUnsignedByte(),
  ) {
    assertIsUnsignedByte(r)
    assertIsUnsignedByte(g)
    assertIsUnsignedByte(b)
    assertIsUnsignedByte(opacity)
  }

  toString() {
    const channels = [this.r, this.g, this.b]
      .map((channel) => {
        const hex = channel.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })

    return '#' + channels.join('')
  }

  toByteArray(): Uint8ClampedArray {
    return new Uint8ClampedArray([this.r, this.g, this.b, this.opacity])
  }

  static fromByteArray(bytes: Uint8ClampedArray) {
    const r = bytes[0]
    const g = bytes[1]
    const b = bytes[2]
    const a = bytes[3]
    return new Color(r, g, b, a)
  }
}
