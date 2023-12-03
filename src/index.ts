import { Organism } from './organism.js';
import { Circle } from './circle.js';
import { Color } from './color.js'

const targetImageElement = document.getElementById('target-image') as HTMLImageElement;
const currentImageCanvasElement = document.getElementById('current-image') as HTMLCanvasElement;

currentImageCanvasElement.setAttribute('width', targetImageElement.clientWidth.toString())
currentImageCanvasElement.setAttribute('height', targetImageElement.clientHeight.toString())
currentImageCanvasElement.style.width = `${targetImageElement.clientWidth}px`
currentImageCanvasElement.style.height = `${targetImageElement.clientHeight}px`

const organism = new Organism(5)

console.log('currentImageCanvasElement:', currentImageCanvasElement)

const context = currentImageCanvasElement.getContext("2d")
if (!context) {
  throw new Error('Could not get the context')
}

// organism.circles = [
//   new Circle(new Color(1, 0, 0, 1), 1, 0, 0),
//   new Circle(new Color(0, 1, 0, 1), 1, 1, 0),
//   new Circle(new Color(0, 0, 1, 1), 1, 0, 1),
//   new Circle(new Color(0, 0, 0, 1), 1, 1, 1)
// ]

organism.render({
  context,
  width: targetImageElement.clientWidth,
  height: targetImageElement.clientHeight
})