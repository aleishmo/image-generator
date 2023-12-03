import { Organism } from './organism.js'

const ORGANSIMS_TO_SELECT_PERCENTAGE = 0.15

export type SimulationStartOptions = {
  populationSize: number
  mutationChance: number
  organismCircleCount: number
  targetImage: HTMLImageElement
  maxGenerations: number
}

export class Simulation {
  private targetImage: HTMLImageElement
  private targetCanvas = document.createElement('canvas')
  private targetContext = this.targetCanvas.getContext('2d')
  private targetPixels: Uint8ClampedArray
  private population: Organism[] = []
  
  start(options: SimulationStartOptions) {
    this.targetImage = options.targetImage

    // Initialize the population by creating populationSize of organisms
    for (let index = 0; index < options.populationSize; index++) {
      const organism = new Organism(options.organismCircleCount)
      this.population.push(organism)
    }

    if (!this.targetContext) throw new Error('Could not get context for target image')

    this.targetCanvas.width = this.targetImage.width
    this.targetCanvas.height = this.targetImage.height
    this.targetContext.drawImage(this.targetImage, 0, 0, this.targetImage.width, this.targetImage.height)
    this.targetPixels = this.targetContext.getImageData(0, 0, this.targetCanvas.width, this.targetCanvas.height).data
    
    const selectCount = Math.ceil(this.population.length * ORGANSIMS_TO_SELECT_PERCENTAGE)
    
    for (let generation = 1; generation <= options.maxGenerations; generation++) {
      // Measure the fitness of each organism ...
      const fitnesses = this.population.map((organism) => this.getFitness(organism))
      
      // Select the best organisms to reproduce ...
      const organismsToReproduce = this.getRandomOrganismIndices(fitnesses, selectCount)

      // Reproduce the selected organisms ...

      // Re-render
    }
  }

  getFitness(organism: Organism) {
    const workingCanvas = document.createElement('canvas')
    const width = this.targetImage.width
    const height = this.targetImage.height
    workingCanvas.width = width
    workingCanvas.height = height

    const workingContext = workingCanvas.getContext('2d')
    if (!workingContext) throw new Error('Could not get context for working image')
    organism.render({ context: workingContext, width, height })
    const organismPixels = workingContext.getImageData(0, 0, workingCanvas.width, workingCanvas.height).data

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
