import { getRandomUnsignedByte } from './getRandomUnsignedByte.js'
import { assertIsUnsignedByte } from './assertIsUnsignedByte.js'
import { ByteArrayReader } from './byteArrayReader.js'

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

  static fromReader(reader: ByteArrayReader) {
    const r = reader.readByte()
    const g = reader.readByte()
    const b = reader.readByte()
    const a = reader.readByte()
    return new Color(r, g, b, a)
  }
}
