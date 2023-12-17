import { getRandomInteger } from './getRandomInteger.js'

export function getRandomUnsignedByte() {
  return getRandomInteger(0, 255)
}