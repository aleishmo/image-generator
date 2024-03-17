import { Organism } from "./organism.js";
import { ByteArrayReader } from './byteArrayReader.js'

export function getMutatedOrganism(organism: Organism, mutationChance: number) {
    let dna = organism.toByteArray()
    let newDNA = flipBitsWithProbability(dna, mutationChance)
    const reader = new ByteArrayReader(newDNA)
    return Organism.fromReader(reader)
}

function flipBitsWithProbability(dna: Uint8ClampedArray, probability: number) {
    const mutatedDNA: Uint8ClampedArray = new Uint8ClampedArray(dna.length)

    for (let byteIndex = 0; byteIndex <= dna.length; byteIndex++) {
        const byte = dna[byteIndex]
        let mutatedByte = 0;

        for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
            const bitValue = (byte >> bitIndex) & 1; // Extracting the bit at the current index

            // Flip the bit based on the probability
            const shouldFlip = Math.random() < probability;
            const flippedBit = shouldFlip ? 1 - bitValue : bitValue;

            // Set the flipped bit in the mutatedByte
            mutatedByte |= flippedBit << bitIndex;
        }

        mutatedDNA[byteIndex] = mutatedByte;
    }

    return mutatedDNA;
}