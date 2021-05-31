import { Events } from '../model/events/Events'
import { log } from '../service/Flogger'
import { Emitter } from '../utils/Emitter'
import { asyncTimeout, exists, functionExists } from '../utils/Utils'

export interface IWave {
    totalEnemies: number
    waveIndex: number
    startSpawnIntervals()
}

export interface WaveOptions {
    waveIndex: number
    onSpawn: Function
    onComplete: Function
}

export class Wave extends Emitter implements IWave {
    _onSpawn: Function
    _onComplete: Function
    totalEnemies: number = 5
    spawnIntervalTime: number = 500
    startDelayTime: number = 3000
    totalSpawns: number = 0
    waveIndex: number = 0

    constructor(options: WaveOptions) {
        super()

        this.waveIndex = options.waveIndex
        this._onSpawn = options.onSpawn
        this._onComplete = options.onComplete
    }

    startSpawnIntervals() {
        log('Wave', 'startSpawnIntervals')

        asyncTimeout(this.startDelayTime).then(() => {
            log('Wave', 'startDelayTime Complete')
            
            setInterval(() => {
                if (this.totalSpawns <= this.totalEnemies) {
                    this.spawnEnemy()
                }
            }, this.spawnIntervalTime)
        })
    }

    spawnEnemy() {
        log('Wave', 'spawnEnemy')

        this.totalSpawns++
        this.emit(Events.SpawnEnemy)

        if (this._onSpawn !== undefined) {
            this._onSpawn()
        }
    }

    set onSpawn(value: Function) {
        this._onSpawn = value
    }

    get onSpawn() {
        return this._onSpawn
    }
}
