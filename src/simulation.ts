import { Organism } from './organism.js'
import { getMutatedOrganism } from './getMutatedOrganism.js'
import { Circle } from './circle.js'

const ORGANSIMS_TO_SELECT_PERCENTAGE = 0.15

type ProgressOptions = {
  generation: number
  fittestOrganism: Organism
  fitness: number
}

type ProgressHandler = (options: ProgressOptions) => void

export type SimulationStartOptions = {
  populationSize: number
  mutationChance: number
  getOrganismCircleCount: (generation: number) => number
  targetImage: HTMLImageElement
  maxGenerations: number
  onProgress: ProgressHandler
}

export class Simulation {
  private targetImage: HTMLImageElement | undefined
  private targetCanvas = document.createElement('canvas')
  private targetContext = this.targetCanvas.getContext('2d')
  private targetPixels: Uint8ClampedArray | undefined
  private population: Organism[] = []
  private workingCanvas = document.createElement('canvas')
  private workingContext = this.workingCanvas.getContext('2d')
  private generation = 0
  private populationSize = 0
  private maxGenerations = 0
  private selectCount = 0
  private mutationChance = 0
  private getOrganismCircleCount!: (generation: number) => number
  private onProgress!: ProgressHandler
  
  start(options: SimulationStartOptions) {
    if (!this.targetContext) throw new Error('Could not get context for target image')

    this.targetImage = options.targetImage
    this.onProgress = options.onProgress
    this.getOrganismCircleCount = options.getOrganismCircleCount

    // Initialize the population by creating populationSize of organisms
    for (let index = 0; index < options.populationSize; index++) {
      const organism = new Organism(this.getOrganismCircleCount(this.generation))
      this.population.push(organism)
    }

    this.targetCanvas.width = this.targetImage.width
    this.targetCanvas.height = this.targetImage.height
    this.targetContext.drawImage(this.targetImage, 0, 0, this.targetImage.width, this.targetImage.height)
    this.targetPixels = this.targetContext.getImageData(0, 0, this.targetCanvas.width, this.targetCanvas.height).data
    
    this.selectCount = Math.ceil(this.population.length * ORGANSIMS_TO_SELECT_PERCENTAGE)

    this.generation = 0
    this.maxGenerations = options.maxGenerations
    this.populationSize = options.populationSize
    this.mutationChance = options.mutationChance

    setTimeout(() => this.generateNextGeneration(), 1)
  }

  private generateNextGeneration() {
    if (this.generation > this.maxGenerations) return

    // Measure the fitness of each organism ...
    const fitnesses = this.population.map((organism) => this.getFitness(organism))
    this.updateProgress(fitnesses, this.generation)

    this.generation++
    
    // Select the organisms to reproduce ...
    const organismIndicesToReproduce = this.getRandomOrganismIndices(fitnesses, this.selectCount)

    const nextGenerationOfOrganisms = organismIndicesToReproduce.map((index) => this.population[index])
    let organismIndexToReproduce = 0

    while (nextGenerationOfOrganisms.length < this.populationSize) {
      const organismToReproduce = this.population[organismIndicesToReproduce[organismIndexToReproduce % organismIndicesToReproduce.length]]
      organismIndexToReproduce++

      const newOrganism = getMutatedOrganism(organismToReproduce, this.mutationChance)
      while (newOrganism.circles.length < this.getOrganismCircleCount(this.generation)) {
        newOrganism.circles.push(new Circle())
      }
      nextGenerationOfOrganisms.push(newOrganism)
    }

    this.population = nextGenerationOfOrganisms

    setTimeout(() => this.generateNextGeneration(), 1)
  }

  private updateProgress( fitnesses: number[], generation: number ) {
    const fitness = fitnesses.reduce((a, b) => Math.max(a, b), 0)
    const indexOfFittestOrganism = fitnesses.indexOf(fitness)
    const fittestOrganism = this.population[indexOfFittestOrganism]
    this.onProgress({ generation, fittestOrganism, fitness })
  }

  getFitness(organism: Organism) {
    if (!this.targetImage || !this.targetPixels) throw new Error('Target image not defined')

    const width = this.targetImage.width
    const height = this.targetImage.height
    this.workingCanvas.width = width
    this.workingCanvas.height = height

    if (!this.workingContext) throw new Error('Could not get context for working image')
    organism.render({ context: this.workingContext, width, height })
    const organismPixels = this.workingContext.getImageData(0, 0, this.workingCanvas.width, this.workingCanvas.height).data

    let totalDifference = 0

    for (let i = 0; i < organismPixels.length; i ++) {
      totalDifference += Math.abs(organismPixels[i] - this.targetPixels[i])
    }

    const worstDifference = 255 * organismPixels.length

    return 1 - totalDifference / worstDifference
  }

  getRandomOrganismIndices(fitnessLevels: number[], count: number): number[] {
    const totalFitness = fitnessLevels.reduce((sum, fitness) => sum + fitness, 0);
    const probabilities = fitnessLevels.map(fitness => fitness / totalFitness);
    const selectedOrganisms: number[] = [];
    
    for (let i = 0; i < count; i++) {
        let randomValue = Math.random();
        let cumulativeProbability = 0;

        for (let j = 0; j < probabilities.length; j++) {
            cumulativeProbability += probabilities[j];
            if (randomValue <= cumulativeProbability) {
                selectedOrganisms.push(j);
                break;
            }
        }
    }

    return selectedOrganisms;
  }
}

// const simulation = new Simulation()
// simulation.start({
//   populationSize: 100,
//   mutationChance: 0.1,
//   organismCircleCount: 5,
// })
