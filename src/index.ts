import { Organism } from './organism.js';
import { Circle } from './circle.js';
import { Color } from './color.js';
import { Simulation } from './simulation.js'

function getElementByIdOrError(id: string) {
  const element = document.getElementById(id)
  if (!element) throw new Error('Could not find element with id: ' + id)
  return element
}

const targetImageElement = getElementByIdOrError('target-image') as HTMLImageElement;
const currentImageCanvasElement = getElementByIdOrError('current-image') as HTMLCanvasElement;

currentImageCanvasElement.setAttribute('width', targetImageElement.clientWidth.toString())
currentImageCanvasElement.setAttribute('height', targetImageElement.clientHeight.toString())
currentImageCanvasElement.style.width = `${targetImageElement.clientWidth}px`
currentImageCanvasElement.style.height = `${targetImageElement.clientHeight}px`

const organism = new Organism(5)

const context = currentImageCanvasElement.getContext("2d")
if (!context) {
  throw new Error('Could not get the context')
}

const simulation = new Simulation()
const maxGenerations = 10000

simulation.start({
  populationSize: 100,
  mutationChance: 0.001,
  organismCircleCount: 20,
  targetImage: targetImageElement,
  maxGenerations,
  onProgress: ({ fittestOrganism, fitness, generation }) => {
    fittestOrganism.render({
      context,
      width: targetImageElement.clientWidth,
      height: targetImageElement.clientHeight
    })
    getElementByIdOrError('fitness').innerText = fitness.toString()
    getElementByIdOrError('generation').innerText = generation.toString()  
    getElementByIdOrError('maxGenerations').innerText = maxGenerations.toString()  
  }
})

organism.render({
  context,
  width: targetImageElement.clientWidth,
  height: targetImageElement.clientHeight
})