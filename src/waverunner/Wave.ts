import { GameLoop } from '../gameloop/GameLoop'
import { IUpdatable } from '../interface/IUpdatable'
import { Events } from '../model/events/Events'
import { importantLog, log } from '../service/Flogger'
import { Emitter } from '../utils/Emitter'
import { asyncTimeout } from '../utils/Utils'

export interface IWave extends IUpdatable {
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
    _isCompleted: boolean = false
    shouldTimeout: boolean = false
    totalEnemies: number = 5
    totalTime: number = 1000 // 3000
    currentTime: number = this.totalTime
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

    update() {
        if (this.shouldTimeout) {
            this.currentTime -= GameLoop.CustomDelta

            if (this.currentTime <= 0) {
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
        })

        this.startCompletionTimer()
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
        this._onComplete()
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
}
