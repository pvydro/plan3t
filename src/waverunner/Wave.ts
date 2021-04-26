import { Events } from '../model/events/Events'
import { log } from '../service/Flogger'
import { Emitter } from '../utils/Emitter'
import { exists, functionExists } from '../utils/Utils'

export interface IWave {
    enemies: number
    startSpawnIntervals()
}

export interface WaveOptions {
    onSpawn: Function
}

export class Wave extends Emitter implements IWave {
    _onSpawn: Function
    enemies: number = 10
    spawnInervalTime: number = 5000

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

        setInterval(() => {
            this.spawnEnemy()
        }, this.spawnInervalTime)
    }

    spawnEnemy() {
        log('Wave', 'spawnEnemy')

        this.emit(Events.SpawnEnemy)

        if (this._onSpawn !== undefined) {
            this._onSpawn()
        }
    }
}
