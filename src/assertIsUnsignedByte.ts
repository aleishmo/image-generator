export function assertIsUnsignedByte(value: unknown) {
  if (typeof value !== 'number' || value < 0 || value > 255 || (value != Math.floor(value))) {
    throw new Error('Value must be an integer between 0 and 255')
  }
}