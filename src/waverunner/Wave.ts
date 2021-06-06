import { Events } from '../model/events/Events'
import { importantLog, log } from '../service/Flogger'
import { Emitter } from '../utils/Emitter'
import { asyncTimeout, exists, functionExists } from '../utils/Utils'

export interface IWave {
    totalEnemies: number
    waveIndex: number
    startSpawnIntervals(): void
}

export interface WaveOptions {
    waveIndex: number
    onSpawn: Function
    onComplete: Function
}

export class Wave extends Emitter implements IWave {
    _onSpawn: Function
    _onComplete: Function
    completionTimeout?: number
    totalEnemies: number = 5
    totalTime: number = 30000
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

        this.startCompletionTimer()
    }

    startCompletionTimer() {
        log('Wave', 'startCompletionTimer')

        if (this.completionTimeout !== undefined) {
            window.clearTimeout(this.completionTimeout)
        }

        this.completionTimeout = window.setTimeout(() => {
            this.complete()
        }, this.totalTime)
    }

    spawnEnemy() {
        log('Wave', 'spawnEnemy')

        this.totalSpawns++
        this.emit(Events.SpawnEnemy)

        if (this._onSpawn !== undefined) {
            this._onSpawn()
        }
    }

    complete() {
        importantLog('Wave', 'complete')

        this._onComplete()
    }

    set onSpawn(value: Function) {
        this._onSpawn = value
    }

    get onSpawn() {
        return this._onSpawn
    }
}
