import { getRandomBool } from '../../../utils/Math'
import { log } from '../../../service/Flogger'
import { asyncTimeout, getRandomValueFromArray } from '../../../utils/Utils'
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

        log('WaveCreatureSpawner', 'start', 'spawnCount', this.spawnCount)

        while (this.spawnCount > 0) {
            await asyncTimeout(this.calculateTimeBetweenSpawns(options))

            this.spawnCount--
            this.spawnCreature(options.type)
        }
    }

    spawnCreature(type: CreatureType | CreatureType[]): void {
        const creatureType = Array.isArray(type) ? getRandomValueFromArray(type) : type
        const spawnPoint = getRandomValueFromArray(this.spawnPoints)
        const creatureSchema = new CreatureSchema().assign({
            creatureType,
            x: spawnPoint, y: -50,
            xVel: 0, yVel: 0
        })

        this.gameState.createCreature(creatureSchema)
    }

    calculateTimeBetweenSpawns(options: WaveCreatureSpawningConfig): number {
        return options.timeBetweenSpawns
            + (Math.random() * options.timeBetweenSpawnsVariance)
            * (getRandomBool() ? 1 : -1)
    }
}
