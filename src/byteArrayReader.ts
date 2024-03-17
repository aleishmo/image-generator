export class ByteArrayReader {
  private position = 0

  constructor(private bytes: Uint8ClampedArray) {
  }

  readByte() {
    const result = this.bytes[this.position]
    this.position++
    return result
  }

  hasReachedEnd() {
    return this.position >= this.bytes.length
  }
}
