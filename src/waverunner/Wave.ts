import { Events } from '../model/events/Events'
import { log } from '../service/Flogger'
import { Emitter } from '../utils/Emitter'
import { asyncTimeout, exists, functionExists } from '../utils/Utils'

export interface IWave {
    totalEnemies: number
    startSpawnIntervals()
}

export interface WaveOptions {
    onSpawn: Function
}

export class Wave extends Emitter implements IWave {
    _onSpawn: Function
    totalEnemies: number = 5
    spawnIntervalTime: number = 2000
    startDelayTime: number = 3000
    totalSpawns: number = 0

    constructor(options?: WaveOptions) {
        super()

        if (exists(options)) {
            if (functionExists(options.onSpawn)) {
                this._onSpawn = options.onSpawn
            }
        }
    }

    startSpawnIntervals() {
        log('Wave', 'startSpawnIntervals')

        asyncTimeout(this.startDelayTime).then(() => {
            log('Wave', 'startDelayTime Complete')
            
            setInterval(() => {
                if (this.totalSpawns < this.totalEnemies) {
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
