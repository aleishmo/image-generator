import { Color } from './color.js'

export class Circle {
  constructor(
    public color = new Color(),
    /**
     * Expressed as percentage of a quarter of the image width (between 0 and 1)
     */
    public radius = Math.random(),
    /**
     * Expressed as percentage of image width (between 0 and 1)
     */
    public x = Math.random(),
    /**
     * Expressed as percentage of image height (between 0 and 1)
     */
    public y = Math.random()
  ) {
  }
}
