import { asyncTimeout, getRandomBool, getRandomValueFromArray } from '../../../utils/Utils'
import { CreatureType } from '../../utils/Enum'
import { CreatureSchema } from '../CreatureSchema'
import { ServerGameState } from '../serverstate/ServerGameState'

export interface WaveCreatureSpawningConfig {
    timeBetweenSpawns: number
    timeBetweenSpawnsVariance: number
    spawnCount: number
    spawnCountVariance: number
    type: CreatureType | CreatureType[]
}

export interface IWaveCreatureSpawner {
    start(options: WaveCreatureSpawningConfig): void
    spawnCount: number
}

export interface WaveCreatureSpawnerOptions {
    spawnPoints: number[]
    gameState: ServerGameState
}

export class WaveCreatureSpawner implements IWaveCreatureSpawner {
    spawnPoints: number[]
    gameState: ServerGameState
    spawnCount: number = 0

    constructor(options: WaveCreatureSpawnerOptions) {
        this.spawnPoints = options.spawnPoints
        this.gameState = options.gameState
    }

    async start(options: WaveCreatureSpawningConfig) {
        this.spawnCount = Math.round(options.spawnCount + (Math.random() * options.spawnCountVariance))

        while (this.spawnCount > 0) {
            await asyncTimeout(this.calculateTimeBetweenSpawns(options))

            this.spawnCreature(options.type)
        }
    }

    spawnCreature(type: CreatureType | CreatureType[]): void {
        if (typeof type === 'string') type = [ type ]

        const creatureType = getRandomValueFromArray(type)
        const spawnPoint = getRandomValueFromArray(this.spawnPoints)
        const creatureSchema = new CreatureSchema().assign({
            creatureType,
            x: spawnPoint, y: -50
        })

        this.gameState.createCreature(creatureSchema)
    }

    calculateTimeBetweenSpawns(options: WaveCreatureSpawningConfig): number {
        return options.timeBetweenSpawns
            + (Math.random() * options.timeBetweenSpawnsVariance)
            * (getRandomBool() ? 1 : -1)
    }
}
