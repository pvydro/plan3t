import { GameLoop } from '../gameloop/GameLoop'
import { IUpdatable } from '../interface/IUpdatable'
import { Events } from '../model/events/Events'
import { WaveSchema } from '../network/schema/waverunnergamestate/WaveSchema'
import { importantLog, log } from '../service/Flogger'
import { Emitter } from '../utils/Emitter'
import { asyncTimeout, functionExists } from '../utils/Utils'

export interface IWave extends IUpdatable {
    totalEnemies: number
    currentTime: number
    currentTimePercentage: number
    waveIndex: number
    elapsedTime: number
    startSpawnIntervals(): void
}

export interface WaveOptions {
    waveIndex: number
    totalTime: number
    elapsedTime: number
    onSpawn?: Function
    onComplete?: Function
}

export class Wave extends Emitter implements IWave {
    _onSpawn: Function
    _onComplete: Function
    _isCompleted: boolean = false
    shouldTimeout: boolean = false
    totalEnemies: number = 2
    totalTime: number = 3000
    elapsedTime: number = 0
    spawnIntervalTime: number = 500
    startDelayTime: number = 3000
    totalSpawns: number = 0
    waveIndex: number = 0

    constructor(options: WaveOptions | WaveSchema) {
        super()

        this.waveIndex = options.waveIndex ?? 0
        this._onSpawn = (options as WaveOptions).onSpawn ?? function() {}
        this._onComplete = (options as WaveOptions).onComplete
    }

    update() {
        if (this.shouldTimeout) {
            this.elapsedTime += GameLoop.CustomDelta

            if (this.elapsedTime >= this.totalTime) {
                this.complete()
            }
        }
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

            this.startCompletionTimer()
        })
    }

    startCompletionTimer() {
        log('Wave', 'startCompletionTimer')

        this.shouldTimeout = true
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

        this.shouldTimeout = false
        this._isCompleted = true

        if (functionExists(this._onComplete)) this._onComplete()
    }

    set onSpawn(value: Function) {
        this._onSpawn = value
    }

    get onSpawn() {
        return this._onSpawn
    }

    get isCompleted() {
        return this._isCompleted
    }

    get currentTime() {
        return this.totalTime - this.elapsedTime
    }

    get currentTimePercentage() {
        return this.currentTime / this.totalTime
    }
}
