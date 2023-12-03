export class Color {
  constructor(
    public r = Math.random(),
    public g = Math.random(),
    public b = Math.random(),
    public opacity = Math.random()
  ) {
  }

  toString() {
    const channels = [this.r, this.g, this.b]
      .map((channel) => Math.round(channel * 255))
      .map((channel) => {
        const hex = channel.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })

    return '#' + channels.join('')
  }
}
